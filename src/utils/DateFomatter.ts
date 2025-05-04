
export const formatToCDT = (dateString: string) => {
    if (!dateString){
      return '';
    } 
    
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
    const invalidDate = 'Invalid Date';
    try {
      const parts = dateString.split("~").map((part) => part.trim());
      if (parts.length < 3){
        return invalidDate;
      } 
      const [_, monthDay, timeZonePart] = parts;
      const currentYear = new Date().getFullYear();
      const fullDateStr = `${monthDay} ${currentYear} ${timeZonePart}`;
      const parsedDate = new Date(fullDateStr);
      if (isNaN(parsedDate.getTime())) {
        console.warn("Invalid parsed date:", fullDateStr);
        return invalidDate;
      }
      const now = new Date();
      const diffTime = parsedDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0){
        return "Event Passed";
      } 
      if (diffDays === 0){
        return "Today";
      } 
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } catch (error) {
      console.error("Error in calculateDaysLeft:", error);
      return invalidDate;
    }
  };
  
  export const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
  export  const getStartOfToday = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    };
  
  export  const getStartOfYesterday = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return yesterday;
    };
  
  export  const getStartOfWeek = () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    };
  
  export  const getStartOfMonth = () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      return startOfMonth;
    };
  
  export  const getEndOfMonth = () => {
      const today = new Date();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return endOfMonth;
    };
  
  export  const getLastMonthStart = () => {
      const today = new Date();
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      lastMonthStart.setHours(0, 0, 0, 0);
      return lastMonthStart;
    };
  
  export const getLastMonthEnd = () => {
      const today = new Date();
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      lastMonthEnd.setHours(23, 59, 59, 999);
      return lastMonthEnd;
    };
