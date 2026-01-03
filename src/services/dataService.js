import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { getPublicImageUrl } from "./storageService";

const createAuthUser = async (email, password, metadata) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const tempClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await tempClient.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;
  return data;
};

const logActivity = async (actionType, description, userId = null) => {
  let uid = userId;
  if (!uid) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.email) {
      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (publicUser) {
        uid = publicUser.id;
      }
    }
  }

  if (uid) {
    await supabase.from("activity_logs").insert([
      {
        user_id: uid,
        action_type: actionType,
        description: description,
      },
    ]);
  }
};

export const dataService = {
  async getDoctors() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "doctor")
      .order("id", { ascending: true });

    if (error) throw error;
    return data;
  },

  async addDoctor(doctor) {
    const { password, ...doctorData } = doctor;

    if (password) {
      try {
        await createAuthUser(doctor.email, password, {
          name: doctor.name,
          role: "doctor",
          status: doctor.status || "Active",
        });
      } catch (authError) {
        console.error("Auth User Creation Failed:", authError);
        throw new Error(`Failed to create Auth account: ${authError.message}`);
      }
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ ...doctorData, role: "doctor" }])
      .select();

    if (error) throw error;

    await logActivity(
      "ADD_DOCTOR",
      `Added new doctor: ${doctor.name}`,
      data[0].id
    );

    return data[0];
  },

  async updateDoctor(id, updates) {
    const { password, ...updateData } = updates;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    await logActivity("UPDATE_DOCTOR", `Updated doctor with ID: ${id}`);

    return data[0];
  },

  async deleteDoctor(id) {
    // 1. Update activity_logs to set user_id to NULL to avoid FK violation
    const { error: logError } = await supabase
      .from("activity_logs")
      .update({ user_id: null })
      .eq("user_id", id);

    if (logError) {
      console.error("Error unlinking activity logs:", logError);
      throw new Error("Failed to unlink activity logs before deleting doctor");
    }

    // 2. Now delete the doctor
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;

    await logActivity("DELETE_DOCTOR", `Deleted doctor with ID: ${id}`);

    return true;
  },

  async getPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select(
        `
        *,
        medical_records (
          original_image_path,
          validation_status,
          doctor_diagnosis
        )
      `
      )
      .order("id", { ascending: true });

    if (error) throw error;

    return data.map((p) => {
      const latestRecord =
        p.medical_records && p.medical_records.length > 0
          ? p.medical_records[p.medical_records.length - 1]
          : null;

      let imageUrl = null;
      if (latestRecord && latestRecord.original_image_path) {
        imageUrl = getPublicImageUrl(
          latestRecord.original_image_path,
          "breast-cancer-images"
        );
      }

      return {
        ...p,
        image: imageUrl,
        review: latestRecord ? latestRecord.validation_status : "-",
      };
    });
  },

  async addPatient(patient) {
    const { name, email, phone, address } = patient;

    const { data, error } = await supabase
      .from("patients")
      .insert([{ name, email, phone, address }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updatePatient(id, updates) {
    const { name, email, phone, address } = updates;

    const { data, error } = await supabase
      .from("patients")
      .update({ name, email, phone, address })
      .eq("id", id)
      .select();

    if (error) throw error;

    await logActivity("UPDATE_PATIENT", `Updated patient with ID: ${id}`);

    return data[0];
  },

  async deletePatient(id) {
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) throw error;

    await logActivity("DELETE_PATIENT", `Deleted patient with ID: ${id}`);

    return true;
  },

  async getActivities() {
    const { data, error } = await supabase
      .from("activity_logs")
      .select(
        `
        *,
        users (name)
      `
      )
      .order("timestamp", { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map((log) => ({
      id: log.id,
      title: log.action_type,
      user: log.users?.name || "Unknown",
      time: new Date(log.timestamp).toLocaleTimeString(),
      iconColor: "bg-blue-100 text-blue-600",
    }));
  },

  async getDashboardStats() {
    const { count: patientCount } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true });
    const { count: doctorCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "doctor");

    const { count: imageCount } = await supabase
      .from("medical_records")
      .select("*", { count: "exact", head: true })
      .not("original_image_path", "is", null);
    const { count: waitingCount } = await supabase
      .from("medical_records")
      .select("*", { count: "exact", head: true })
      .eq("validation_status", "PENDING");

    return [
      {
        label: "Total Patient",
        value: patientCount || 0,
        icon: "users",
        color: "blue",
      },
      {
        label: "Total Doctor",
        value: doctorCount || 0,
        icon: "user-md",
        color: "green",
      },
      {
        label: "Image Uploaded",
        value: imageCount || 0,
        icon: "image",
        color: "blue",
      },
      {
        label: "Waiting For Review",
        value: waitingCount || 0,
        icon: "clock",
        color: "red",
      },
    ];
  },

  async uploadMedicalRecord(patientId, file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${patientId}_${Date.now()}.${fileExt}`;
    const filePath = `raw/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("breast-cancer-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      throw uploadError;
    }

    const { data, error: dbError } = await supabase
      .from("medical_records")
      .insert([
        {
          patient_id: patientId,
          original_image_path: filePath,
          validation_status: "PENDING",
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) throw dbError;

    await logActivity(
      "UPLOAD_IMAGE",
      `Uploaded medical record for patient ID: ${patientId}`
    );

    return data[0];
  },

  async logAIAnalysis(patientId, result = "Analysis Run") {
    await logActivity(
      "AI_ANALYSIS",
      `Performed AI Analysis for patient ID: ${patientId}. Result: ${result}`
    );
  },
};
