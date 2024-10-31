import { useTheme } from '@/components/theme-provider';
import { useEffect } from 'react';

function useThemeProvider() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const checkTimeAndSetTheme = () => {
      const currentDate = new Date();

      // Calculate Indian Standard Time (IST), UTC + 5:30
      const utcOffset = currentDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const indiaTime = new Date(
        currentDate.getTime() + utcOffset + 5.5 * 60 * 60000,
      ); // Add 5:30 hours to UTC

      const hours = indiaTime.getHours();

      // If time is between 6 AM and 6 PM, set theme to "light", else "dark"
      if (hours >= 6 && hours < 18) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };

    checkTimeAndSetTheme(); // Check time immediately on mount

    // Optionally, set up an interval to keep checking (e.g., every minute)
    const intervalId = setInterval(checkTimeAndSetTheme, 60 * 1000); // Check every minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [setTheme]);
}

export default useThemeProvider;
