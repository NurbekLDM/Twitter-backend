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
};

export default userModel;
