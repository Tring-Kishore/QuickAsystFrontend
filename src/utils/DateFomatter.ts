
export const formatToCDT = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  export const calculateDaysLeft = (dateString: string): string => {
    try {
      const parts = dateString.split("~").map((part) => part.trim());
      if (parts.length < 3) return "Invalid Date";
      const [_, monthDay, timeZonePart] = parts;
      const currentYear = new Date().getFullYear();
      const fullDateStr = `${monthDay} ${currentYear} ${timeZonePart}`;
      const parsedDate = new Date(fullDateStr);
      if (isNaN(parsedDate.getTime())) {
        console.warn("Invalid parsed date:", fullDateStr);
        return "Invalid Date";
      }
      const now = new Date();
      const diffTime = parsedDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return "Event Passed";
      if (diffDays === 0) return "Today";
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } catch (error) {
      console.error("Error in calculateDaysLeft:", error);
      return "Invalid Date";
    }
  };
  
  