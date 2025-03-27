import supabase from "../config/db.js";

const likeHistoryModel = {  
  async create(userId, postId) {
    const { data, error } = await supabase
      .from("like_history")
      .insert([{ user_id: userId, post_id: postId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findByUserAndPost(userId, postId) {
    const { data, error } = await supabase
      .from("like_history")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async delete(userId, postId) {
    const { error } = await supabase
      .from("like_history")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;
    return true;
  },
};

export default likeHistoryModel;
