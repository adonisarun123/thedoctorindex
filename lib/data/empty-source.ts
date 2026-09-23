import "server-only";

import type { DataSource } from "@/lib/data";

/**
 * A source with no records. Used only while `next build` prerenders against
 * a database that is unreachable or not yet migrated (see lib/db/readiness.ts),
 * so the deploy succeeds and the affected pages regenerate on revalidation.
 */
export const emptySource: DataSource = {
  getDoctorBySlug: async () => null,
  canonicalDoctorPath: async () => null,
  pathRedirect: async () => null,
  findByRegistration: async () => null,
  getListing: async () => [],
  countIndexable: async () => 0,
  countsBySpecialty: async () => ({}),
  countsByCity: async () => [],
  countsByLocality: async () => ({}),
  countsByLocalitySpecialty: async () => [],
  countsByCitySpecialty: async () => [],
  countsByLocalityAll: async () => [],
  countsByState: async () => ({}),
  totals: async () => ({ published: 0, indexable: 0, claimed: 0, practices: 0, cities: 0 }),
  supplyProfile: async () => ({ total: 0, withRegistration: 0, registerChecked: 0, claimed: 0, withAbout: 0, withExperience: 0, medianYears: null, facilities: 0, localities: 0, withFee: 0, feeMin: null, feeMax: null, qualifications: [], councils: [], subspecialties: [] }),
  searchDoctors: async () => [],
  suggestDoctors: async () => [],
  getNearby: async () => [],
  getAtFacility: async () => [],
  getFeatured: async () => [],
  listIndexableSlugs: async () => [],
  getDoctorByDbId: async () => null,
};
