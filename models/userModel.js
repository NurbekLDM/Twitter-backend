import supabase from "../config/db.js";

const userModel = {
  async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select();

    if (error) throw error;
    return data[0];
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, userData) {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async followUser(followerId, followingId) {
    const { data, error } = await supabase
      .from("follows")
      .insert([{ follower_id: followerId, following_id: followingId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async unfollowUser(followerId, followingId) {
    const { data, error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async getFollowingCount(userId) {
    const { data, error } = await supabase
      .from("follows")
      .select("*", { count: "exact" })
      .eq("follower_id", userId);

    if (error) throw error;
    return data.length;
  },

  async getFollowersCount(userId) {
    const { data, error } = await supabase
      .from("follows")
      .select("*", { count: "exact" })
      .eq("following_id", userId);

    if (error) throw error;
    return data.length;
  },
};

export default userModel;
