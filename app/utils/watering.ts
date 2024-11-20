/**
 * Function to calculate the next watering date based on the plant's watering schedule and last watered date.
 * 
 * This function performs the following steps:
 * 1. Determines the current season (spring/summer or fall/winter).
 * 2. Selects the appropriate watering frequency based on the season.
 * 3. Parses the frequency to calculate the next watering date.
 * 
 * @param schedule - An object containing the watering schedule for spring/summer and fall/winter.
 * @param lastWateredDate - A string representing the last date the plant was watered.
 * @returns An object containing the beginning watering date and the due date for the next watering, or null if the schedule or last watered date is not provided.
 */
  
  export const calculateNextWateringDate = (
    schedule: { spring_summer?: string; fall_winter?: string },
    lastWateredDate: string
  ): { beginningWatering: string; dueDate: string } | null => {
    if (!schedule || !lastWateredDate) return null;

    // Determine the current season
    const month = new Date().getMonth(); // 0-11
    const isSpringSummer = month >= 2 && month <= 7; // March to August
    let frequency = isSpringSummer ? schedule.spring_summer : schedule.fall_winter;

    // Use spring_summer as default if fall_winter is null
    if (!frequency) {
      frequency = schedule.spring_summer;
    }

    // If still no frequency, try the other season's frequency
    if (!frequency) {
      frequency = isSpringSummer ? schedule.fall_winter : schedule.spring_summer;
    }

    if (!frequency) return null;

    // Parse the frequency and calculate the next watering date
    const result = parseFrequencyToDays(frequency, lastWateredDate);
    if (!result) return null;

    const { daysToAdd, beginningWatering, dueDate } = result;
    return { beginningWatering, dueDate };
  };


/**
 * Parses a watering frequency string and returns the average number of days.
 * 
 * This function performs the following steps:
 * 1. Converts the frequency string to lowercase for uniformity.
 * 2. Parses the last watered date and checks for validity.
 * 3. Determines the number of days to add based on the frequency string.
 * 4. Calculates the next watering date.
 * 
 * @param frequency - A string representing the watering frequency (e.g., "3-5 days", "1 week", "2 months").
 * @param lastWateredDate - A string representing the last date the plant was watered.
 * @returns An object containing the number of days to add, the beginning watering date, and the due date for the next watering, or null if the frequency or last watered date is not provided or invalid.
 */
  export const parseFrequencyToDays = (
    frequency: string,
    lastWateredDate: string
  ): { daysToAdd: number; beginningWatering: string; dueDate: string } | null => {
    if (!frequency || !lastWateredDate) return null;
    frequency = frequency.toLowerCase();

    const lastWatered = new Date(lastWateredDate);
    if (isNaN(lastWatered.getTime())) return null; // Check for invalid date

    let daysToAdd: number | null = null;
    let beginningWatering = lastWatered.toISOString(); // ISO format
    let dueDate: string | null = null;

    if (frequency.includes('day')) {
      const match = frequency.match(/(\d+)(?:-(\d+))?\s*day/);
      if (match) {
        const minDays = parseInt(match[1], 10);
        const maxDays = match[2] ? parseInt(match[2], 10) : minDays;
        daysToAdd = maxDays; // Use the maximum value
      }
    } else if (frequency.includes('week')) {
      const match = frequency.match(/(\d+)?\s*week/);
      if (match) {
        const weeks = match[1] ? parseInt(match[1], 10) : 1;
        daysToAdd = weeks * 7;
      }
    } else if (frequency.includes('month')) {
      const match = frequency.match(/(\d+)?\s*month/);
      if (match) {
        const months = match[1] ? parseInt(match[1], 10) : 1;
        daysToAdd = months * 28; // Approximate a month as 28 days
      }
    }

    if (daysToAdd !== null) {
      const nextWatering = new Date(lastWatered.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      dueDate = nextWatering.toISOString(); // ISO format
    }

    return daysToAdd !== null && dueDate
      ? { daysToAdd, beginningWatering, dueDate }
      : null;
  };