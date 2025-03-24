import supabase from "../config/db.js";

const commentModel = {
  async create(commentData) {
    const { data, error } = await supabase
      .from("comments")
      .insert([commentData])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByPostId(postId) {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        users:user_id (
          id,
          username,
          profile_picture
        ),
        comment_likes(count)
      `
      )
      .eq("post_id", postId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async update(id, userId, commentData) {
    const { data, error } = await supabase
      .from("comments")
      .update(commentData)
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(id, userId) {
    // check comments belongs to the user
    const { data: comment, error: findError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (findError) throw findError;
    if (!comment) throw new Error("Comment not found or not owned by user");


    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  async likeComment(userId, commentId) {
    const { data, error } = await supabase
      .from("comment_likes")
      .insert([{ user_id: userId, comment_id: commentId }]);

    if (error) throw error;
    return data[0];
  },

  async unlikeComment(userId, commentId) {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("user_id", userId)
      .eq("comment_id", commentId);

    if (error) throw error;
    return true;
  },

  async getUserLikedComments(userId) {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", userId);

    if (error) throw error;
    return data.map(like => like.comment_id);
  },


};

export default commentModel;
