/**
 * Checks if a Latitude/Longitude pair is "partially" filled.
 * It is considered partial (invalid) if exactly one coordinate is provided
 * and the other is missing/empty.
 *
 * @param lat Latitude value (string, number, or undefined/null)
 * @param lng Longitude value (string, number, or undefined/null)
 * @returns true if exactly one is present, false otherwise (both present or both absent)
 */
export const isLatLngPartial = (
  lat?: string | number | null,
  lng?: string | number | null,
): boolean => {
  const isLatFilled = lat !== undefined && lat !== null && lat !== "";
  const isLngFilled = lng !== undefined && lng !== null && lng !== "";
  return (isLatFilled && !isLngFilled) || (!isLatFilled && isLngFilled);
};
