import { Auth } from '@supabase/auth-ui-react'
import { ThemeMinimal, ThemeSupa, darkThemes } from '@supabase/auth-ui-shared'
import { AnimatePresence, motion } from 'framer-motion';

import "./Login.css";
import get_supabase from '../../supabase';
import { useEffect } from 'react';

export default function Login({set_open_login, set_session}) {
    const supabase = get_supabase();

    useEffect(() => {   
        console.log("here-here");
        const data = supabase.auth.onAuthStateChange((e, session) => {
            if(!session) return;
            console.log("here");
            set_session(session);
            set_open_login(prev => false);
        })
        return () => data.data.subscription.unsubscribe();
    }, []); 

    const handel_on_click = (e) => {
        if(e.target.id != "login-wrapper") return;
        set_open_login(false);
    }

    return (
        <>
            <motion.div id = "login-wrapper" onClick={handel_on_click}>
                <motion.div id="login"
                    initial = {{scale: 0}}
                    animate = {{scale: 1}}
                    exit={{scale: 0}}
                    transition={{duration : .7, type: "spring"}}
                >
                    <Auth
                        supabaseClient = {supabase}
                        appearance = {{theme : ThemeSupa}}
                        providers = {["google"]}
                        theme = "dark"
                    />
                </motion.div>
            </motion.div>
        </>
    )
}