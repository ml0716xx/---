/**
 * LBS Algorithm Logic for Geofence Validation
 * Uses the Haversine formula to calculate the great-circle distance between two points on a sphere.
 */

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Validates if the user is within the specified radius of the target location.
 * @param userLat User's current latitude
 * @param userLon User's current longitude
 * @param targetLat Target destination latitude
 * @param targetLon Target destination longitude
 * @param radius Allowed radius in meters (default 200m)
 * @returns boolean indicating if user is within geofence
 */
export function checkGeofence(
  userLat: number, 
  userLon: number, 
  targetLat: number, 
  targetLon: number, 
  radius: number = 200
): { isWithin: boolean; distance: number } {
  const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
  return {
    isWithin: distance <= radius,
    distance: Math.round(distance)
  };
}

/**
 * Mock function to simulate smart dispatch matching based on LBS and skills
 */
export function matchCaregiver(
  taskLat: number, 
  taskLon: number, 
  taskSkills: string[], 
  caregivers: any[]
) {
  return caregivers.filter(cg => {
    // 1. Check distance (3-5 km radius)
    const distance = calculateDistance(taskLat, taskLon, cg.lat, cg.lon);
    if (distance > 5000) return false;

    // 2. Check skills intersection
    const hasRequiredSkills = taskSkills.every(skill => cg.skills.includes(skill));
    if (!hasRequiredSkills) return false;

    return true;
  }).sort((a, b) => {
    // Sort by distance
    return calculateDistance(taskLat, taskLon, a.lat, a.lon) - 
           calculateDistance(taskLat, taskLon, b.lat, b.lon);
  });
}
