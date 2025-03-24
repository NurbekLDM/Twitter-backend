import supabase from "../config/db.js";

const postModel = {
  async create(postData) {
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findAll() {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        users: user_id (username, profile_picture),
        comments(count),
        likes(count)
      `)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
},



  async findById(id) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByUserId(id) {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        user_id,
        text,
        image,
        date,
        users(username, profile_picture),
        comments(count),
        likes(count)
      `)
      .eq("user_id", id.toString())
      .order("date", { ascending: false });

    return { data, error };
},


  async update(id, userId, postData) {
    const { data, error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(id, userId) {
    const { data: post, error: findError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (findError) throw findError;
    if (!post) throw new Error("Post not found or not owned by user");

    // Then delete the post
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  async incrementLikes(id) {
    const { data, error } = await supabase.rpc("increment_post_likes", {
      post_id: id,
    });

    if (error) throw error;
    return data;
  },

  async decrementLikes(id) {
    const { data, error } = await supabase.rpc("decrement_post_likes", {
      post_id: id,
    });

    if (error) throw error;
    return data;
  },
};

export default postModel;
