-- Foreign-key columns every profile hydration and admin queue filters on, none indexed.
-- doctor_qualifications alone made /search take 4 s: each result set loaded
-- qualifications with a sequential scan over the NMC-import rows. Additive only.
CREATE INDEX "appointments_practice_idx" ON "appointments" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "corrections_doctor_idx" ON "corrections" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_claims_doctor_idx" ON "doctor_claims" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_experience_doctor_idx" ON "doctor_experience" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_qualifications_doctor_idx" ON "doctor_qualifications" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_responses_doctor_idx" ON "doctor_responses" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_submissions_doctor_idx" ON "doctor_submissions" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "enquiries_user_idx" ON "enquiries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_reports_doctor_idx" ON "profile_reports" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "qualification_evidence_doctor_idx" ON "qualification_evidence" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "review_evidence_review_idx" ON "review_evidence" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "reviews_author_idx" ON "reviews" USING btree ("author_user_id");