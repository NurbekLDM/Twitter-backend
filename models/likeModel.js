import supabase from "../config/db.js";

const likeModel = {
  async likePost(userId, postId) {
    const { error: likeError } = await supabase
      .from("likes")
      .insert([{ user_id: userId, post_id: postId }]);

    if (likeError) throw likeError;

    const { error: historyError } = await supabase
      .from("like_history")
      .insert([{ user_id: userId, post_id: postId, action: "like" }]);

    if (historyError) throw historyError;

    return { message: "Post liked successfully" };
  },

  async unlikePost(userId, postId) {
    const { error: unlikeError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (unlikeError) throw unlikeError;

    const { error: historyError } = await supabase
      .from("like_history")
      .insert([{ user_id: userId, post_id: postId, action: "unlike" }]);

    if (historyError) throw historyError;

    return { message: "Post unliked successfully" };
  },

  async isPostLiked(userId, postId) {
    const { data, error } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;
    return data.length > 0;
  },

  async getLikedPostsByUser(userId) {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },



};

export default likeModel;
