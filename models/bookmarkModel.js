import supabase from "../config/db.js";

const bookmarkModel = {
  async create(userId, postId) {
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ user_id: userId, post_id: postId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findByUserAndPost(userId, postId) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async findByUser(userId) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select(
        `*,
        posts:post_id (*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },

  async delete(userId, postId) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;
    return true;
  },

  async getBookmarkedPostsByUser() {
    const { data, error } = await supabase
      .from("bookmarks")
      .select(`
        post_id,
        posts (
          *,
          users:users(*), 
          likes:likes (count),
          comments(count)
        )
      `)
      .order("created_at", { ascending: false });
  
    if (error) throw error;
    return data;
  }
  
  
  
};

export default bookmarkModel;
