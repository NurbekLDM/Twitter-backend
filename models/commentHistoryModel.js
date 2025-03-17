import supabase from "../config/db.js";

const commentHistoryModel = {
  async create(userId, postId, commentId) {
    const { data, error } = await supabase
      .from("comment_history")
      .insert([{ user_id: userId, post_id: postId, comment_id: commentId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findByComment(commentId) {
    const { data, error } = await supabase
      .from("comment_history")
      .select("*")
      .eq("comment_id", commentId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async deleteByComment(commentId) {
    const { error } = await supabase
      .from("comment_history")
      .delete()
      .eq("comment_id", commentId);

    if (error) throw error;
    return true;
  },
};

export default commentHistoryModel;
