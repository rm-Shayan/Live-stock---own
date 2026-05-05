/**
 * Shared UI constants for consistent layout across iOS, Android, and Web.
 */

/** Default avatar used across the app (TopAppBar, Profile, Settings, Users) */
export const DEFAULT_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjkv1xVKHzATrIt7zQlFxczG3MbCp2DFZ5_r6fYv5U61dqqDapZ3m9ypQv0c3mtxOrfyJdbjqrxRIyvxyW_6U-Jx53he5G2Yyr_KxO8tRvDP_9nJxH1sV0nFnHf7InaME1HyWbckcwxA-KbWMM7f5nDxSvB1yfqcBRDUW6LZLyqeTagPscY7oefUeZhqjdfwyLIhPgnJaSEMGc10wHlMGupOKkxZHZxpl5-x-xKqZdx281JFwtn2PAygwKA95ORgSZw6HarrBFnmA";

/** Height of the TopAppBar content area (below safe-area inset) */
export const TOP_BAR_CONTENT_HEIGHT = 50;

/** Height of the BottomNavBar content area (above safe-area inset) */
export const BOTTOM_NAV_CONTENT_HEIGHT = 72;

/** Consistent background color for the TopAppBar on all platforms */
export const TOP_BAR_BG = "#f8faf9"; // Softer, more neutral off-white to reduce eye strain

/**
 * Calculate paddingTop for ScrollView content below an absolute TopAppBar.
 * Accounts for TopAppBar height (56 base + 8 extra for home) + 20 padding.
 * Usage: paddingTop: insets.top + SCROLL_TOP_OFFSET
 */
import { Platform } from 'react-native';

export const SCROLL_TOP_OFFSET = 20; // Standard top margin since header is now relative

/**
 * Consistent paddingBottom for ScrollView content above BottomNavBar.
 * Accounts for nav bar height + FAB + extra breathing room.
 */
export const SCROLL_BOTTOM_PADDING = 100;

/**
 * Consistent bottom offset for a FAB positioned above BottomNavBar.
 * Usage: bottom: insets.bottom + FAB_BOTTOM_OFFSET
 */
export const FAB_BOTTOM_OFFSET = 90;
