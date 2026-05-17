import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { callGemini } from '@/lib/gemini';
import { buildPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Validate auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appSlug, inputs } = body;

    if (!appSlug || !inputs) {
      return NextResponse.json({ error: 'Missing appSlug or inputs' }, { status: 400 });
    }

    // Get micro_app
    const { data: appData, error: appError } = await supabase
      .from('micro_apps')
      .select('id, prompt_template')
      .eq('slug', appSlug)
      .single();

    if (appError || !appData) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Insert pending execution
    const { data: execution, error: insertError } = await supabase
      .from('app_executions')
      .insert({
        user_id: user.id,
        app_id: appData.id,
        inputs,
        status: 'pending'
      })
      .select('id')
      .single();

    if (insertError || !execution) {
      return NextResponse.json({ error: 'Failed to create execution' }, { status: 500 });
    }

    // Process in background
    after(async () => {
      try {
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SECRET_KEY!
        );

        // Update status to processing
        await adminSupabase
          .from('app_executions')
          .update({ status: 'processing' })
          .eq('id', execution.id);

        // Improve language instruction for Gemini
        const promptInputs = { ...inputs };
        if (promptInputs.responseLanguage === 'en') {
          promptInputs.responseLanguage = 'English';
        } else if (promptInputs.responseLanguage === 'es') {
          promptInputs.responseLanguage = 'Spanish';
        }

        const prompt = buildPrompt(appData.prompt_template, promptInputs);
        
        let markdownResult = '';
        try {
          markdownResult = await callGemini(prompt);
        } catch (geminiError: unknown) {
          const errorMessage = geminiError instanceof Error ? geminiError.message : 'Error calling Gemini';
          await adminSupabase
            .from('app_executions')
            .update({ 
              status: 'error', 
              error_message: errorMessage,
              completed_at: new Date().toISOString()
            })
            .eq('id', execution.id);
          return;
        }

        // Success
        await adminSupabase
          .from('app_executions')
          .update({ 
            status: 'completed', 
            result: { markdown: markdownResult },
            completed_at: new Date().toISOString()
          })
          .eq('id', execution.id);
          
      } catch (backgroundError) {
        console.error('Background execution error:', backgroundError);
      }
    });

    return NextResponse.json({ executionId: execution.id });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
