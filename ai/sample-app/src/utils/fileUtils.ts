import { Part } from "firebase/ai";

/**
 * Converts a File object into a Firebase AI SDK Part object suitable for multimodal requests.
 * Reads the file as a base64-encoded string and includes its MIME type.
 *
 * @param file The File object (e.g., from an <input type="file"> element).
 * @returns A Promise resolving to a Part object containing inline base64 data and MIME type.
 * @throws An error if the file cannot be read or processed.
 */
export async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The FileReader result includes the Data URL prefix (e.g., "data:image/jpeg;base64,").
      // We only need the actual base64 data part after the comma.
      const base64String = reader.result as string;
      if (base64String && base64String.includes(",")) {
        resolve(base64String.split(",")[1]);
      } else {
        // Handle cases where the result might be unexpected (e.g., empty file)
        reject(new Error("Invalid file data format received from FileReader."));
      }
    };
    reader.onerror = (errorEvent) => {
      // Provide more context about the error
      reject(
        new Error(
          `FileReader error: ${errorEvent?.target?.error?.message || "Unknown error"}`,
        ),
      );
    };
    // Start reading the file
    reader.readAsDataURL(file);
  });

  try {
    const base64EncodedData = await base64EncodedDataPromise;
    // Construct the Part object required by the SDK
    return {
      inlineData: {
        data: base64EncodedData,
        mimeType: file.type, // Use the file's original MIME type
      },
    };
  } catch (error) {
    console.error("Error converting file to Generative Part:", error);
    // Rethrow a more user-friendly error
    throw new Error(
      `Failed to process the file "${file.name}". Please ensure it's a valid file.`,
    );
  }
}
