import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL, 
    process.env.REACT_APP_SUPABASE_ANON_KEY
    ) 

    // const handleLogin = async () => {
    //     // Tutaj umieść logikę po zalogowaniu się, jeśli jest to konieczne

    //     // Przekierowanie na inną stronę
    //     window.location.href = 'ADRES_INNEJ_STRONY';
    //     };

    //     // Subskrypcja na zdarzenia autentykacji
    //     const authListener = supabase.auth.onAuthStateChange((event, session) => {
    //     if (event === 'SIGNED_IN') {
    //         handleLogin();
    //     }
    //     });

