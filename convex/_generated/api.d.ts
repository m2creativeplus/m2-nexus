/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academicMeta from "../academicMeta.js";
import type * as additional from "../additional.js";
import type * as attendance from "../attendance.js";
import type * as classes from "../classes.js";
import type * as contentItems from "../contentItems.js";
import type * as core from "../core.js";
import type * as dashboard from "../dashboard.js";
import type * as events from "../events.js";
import type * as examinations from "../examinations.js";
import type * as expenses from "../expenses.js";
import type * as feeManagement from "../feeManagement.js";
import type * as fees from "../fees.js";
import type * as frontOffice from "../frontOffice.js";
import type * as homework from "../homework.js";
import type * as hostel from "../hostel.js";
import type * as income from "../income.js";
import type * as inventory from "../inventory.js";
import type * as library from "../library.js";
import type * as m2_agent from "../m2_agent.js";
import type * as news from "../news.js";
import type * as nexus from "../nexus.js";
import type * as notifications from "../notifications.js";
import type * as onlineExam from "../onlineExam.js";
import type * as portfolio from "../portfolio.js";
import type * as reports from "../reports.js";
import type * as sections from "../sections.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as staff from "../staff.js";
import type * as students from "../students.js";
import type * as subjects from "../subjects.js";
import type * as timetables from "../timetables.js";
import type * as transport from "../transport.js";
import type * as virtualClasses from "../virtualClasses.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academicMeta: typeof academicMeta;
  additional: typeof additional;
  attendance: typeof attendance;
  classes: typeof classes;
  contentItems: typeof contentItems;
  core: typeof core;
  dashboard: typeof dashboard;
  events: typeof events;
  examinations: typeof examinations;
  expenses: typeof expenses;
  feeManagement: typeof feeManagement;
  fees: typeof fees;
  frontOffice: typeof frontOffice;
  homework: typeof homework;
  hostel: typeof hostel;
  income: typeof income;
  inventory: typeof inventory;
  library: typeof library;
  m2_agent: typeof m2_agent;
  news: typeof news;
  nexus: typeof nexus;
  notifications: typeof notifications;
  onlineExam: typeof onlineExam;
  portfolio: typeof portfolio;
  reports: typeof reports;
  sections: typeof sections;
  seed: typeof seed;
  settings: typeof settings;
  staff: typeof staff;
  students: typeof students;
  subjects: typeof subjects;
  timetables: typeof timetables;
  transport: typeof transport;
  virtualClasses: typeof virtualClasses;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
