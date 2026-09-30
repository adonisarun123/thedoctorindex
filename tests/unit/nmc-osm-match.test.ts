import assert from "node:assert/strict";
import { test } from "node:test";

import { osmNamesDoctor } from "../../lib/nmc/osm-match";

test("OSM place must carry the whole name and nobody else's", () => {
  assert.equal(osmNamesDoctor("Dr. Haja Mohideen Clinic", "Haja Mohideen", "paediatrics").ok, true);
  assert.equal(osmNamesDoctor("Balarami Reddy Skin & Cosmetology Clinic", "Balarami Reddy K", "dermatology").ok, false, "two tokens, no Dr");
  assert.equal(osmNamesDoctor("Dr Balarami Reddy Skin & Cosmetology Clinic", "Balarami Reddy K", "dermatology").ok, true);
  assert.equal(osmNamesDoctor("Dr. E. Sai Prasad Hospital", "Sai Prasad Tadi", "ent").ok, false);
  assert.equal(osmNamesDoctor("Hima Bindu Hospital", "Bura Hima Bindu", "ophthalmology").ok, false);
  assert.equal(osmNamesDoctor("Dr. Krishna Mohan Rao Hospital", "Saripalli Krishna Rao", "dermatology").ok, false);
  assert.equal(osmNamesDoctor("Dr. Livtar Singh Chawla", "Gurmeet Singh Chawla", "paediatrics").ok, false);
  assert.equal(osmNamesDoctor("Dr. Sachin Patil Clinic", "Sachin Deepak Patil", "psychiatry").ok, false);
  assert.equal(osmNamesDoctor("Dr Ramesh", "Ramesh", "cardiology").ok, false);
  assert.equal(osmNamesDoctor("Dr. E. Sai Prasad Hospital", "G. Sai Prasad", "dermatology").ok, false);
  assert.equal(osmNamesDoctor("Dr. P N Narasimha Reddy Clinic", "G Narasimha Reddy", "urology").ok, false);
  assert.equal(osmNamesDoctor("Dr. N Suresh Kumar", "Suresh Kumar", "orthopaedics").ok, true);
  assert.equal(osmNamesDoctor("Dr. S. Satish Kumar M.D.S", "Satish Kumar", "surgical-oncology").ok, false);
});

test("a speciality word in the place name must fit the doctor", () => {
  assert.equal(osmNamesDoctor("Hari Prasad ENT Hospital", "Hari Prasad", "ophthalmology").ok, false);
  assert.equal(osmNamesDoctor("Dr Hari Prasad ENT Hospital", "Hari Prasad", "ent").ok, true);
  assert.equal(osmNamesDoctor("Satyanarayana Murthy Eye Centre", "Satyanarayana Murthy", "orthopaedics").ok, false);
  assert.equal(osmNamesDoctor("Dr. Sreenivasa Rao Skin Specialist", "Sreenivasa Rao", "general-surgery").ok, false);
  assert.equal(osmNamesDoctor("Dr Surendra Kumar Children's Hospital", "Surendra Kumar", "paediatrics").ok, true);
  assert.equal(osmNamesDoctor("Dr Surendra Kumar Children's Hospital", "Surendra Kumar", "general-surgery").ok, false);
  assert.equal(osmNamesDoctor("Sai Kiran Polyclinic", "Sai Kiran", "internal-medicine").ok, false, "two-token name without Dr");
  assert.equal(osmNamesDoctor("Sai Kiran Polyclinic", "Kakarla Sai Kiran", "internal-medicine").ok, false, "surname missing");
  assert.equal(osmNamesDoctor("Dr. Sai Kiran Polyclinic", "Sai Kiran", "internal-medicine").ok, true);
});
