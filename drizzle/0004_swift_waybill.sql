CREATE INDEX "deliveries_user_updated_idx" ON "deliveries" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "deliveries_status_updated_idx" ON "deliveries" USING btree ("status","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_routes_delivery_sequence_unique" ON "delivery_routes" USING btree ("delivery_id","sequence");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_routes_current_unique" ON "delivery_routes" USING btree ("delivery_id") WHERE "is_current_location" = true;--> statement-breakpoint
CREATE INDEX "delivery_routes_delivery_reached_idx" ON "delivery_routes" USING btree ("delivery_id","reached_at");
