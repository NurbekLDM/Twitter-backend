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
        )
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
    // First check if the comment belongs to the user
    const { data: comment, error: findError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (findError) throw findError;
    if (!comment) throw new Error("Comment not found or not owned by user");

    // Then delete the comment
    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  async incrementLikes(id) {
    // Retrieve current likes
    const { data: comment, error: findError } = await supabase
      .from("comments")
      .select("likes")
      .eq("id", id)
      .single();
    if (findError) throw findError;

    // Update likes count
    const newLikes = (comment?.likes || 0) + 1;
    const { data: updated, error: updateError } = await supabase
      .from("comments")
      .update({ likes: newLikes })
      .eq("id", id)
      .select();
    if (updateError) throw updateError;
    return updated[0];
  },

  async decrementLikes(id) {
    // Retrieve current likes
    const { data: comment, error: findError } = await supabase
      .from("comments")
      .select("likes")
      .eq("id", id)
      .single();
    if (findError) throw findError;

    // Update likes count
    const newLikes = Math.max((comment?.likes || 0) - 1, 0);
    const { data: updated, error: updateError } = await supabase
      .from("comments")
      .update({ likes: newLikes })
      .eq("id", id)
      .select();
    if (updateError) throw updateError;
    return updated[0];
  },
};

export default commentModel;
