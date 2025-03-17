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

  async findById(id) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
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
    // First check if the post belongs to the user
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
