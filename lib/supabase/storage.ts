import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "business-images";

export async function uploadBusinessImage(
  file: File,
    businessId: string,
      folder: string = "products"
      ) {
        const supabase = createClient();

          const fileExtension = file.name.split(".").pop() || "webp";

            const fileName = `${crypto.randomUUID()}.${fileExtension}`;

              const filePath = `${businessId}/${folder}/${fileName}`;

                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                        .upload(filePath, file, {
                              cacheControl: "3600",
                                    upsert: false,
                                          contentType: file.type,
                                              });

                                                if (error) {
                                                    throw new Error(error.message);
                                                      }

                                                        const {
                                                            data: { publicUrl },
                                                              } = supabase.storage
                                                                  .from(BUCKET_NAME)
                                                                      .getPublicUrl(filePath);

                                                                        return {
                                                                            path: filePath,
                                                                                publicUrl,
                                                                                  };
                                                                                  }