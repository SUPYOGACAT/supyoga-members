import { createAdminClient } from './src/utils/supabase/admin'

async function check() {
    const supabase = createAdminClient()
    const { data: reflections, error } = await supabase
        .from('reflections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    console.log("Reflections error:", error)
    console.log("Last 10 Reflections:")
    console.log(JSON.stringify(reflections, null, 2))
}

check()
