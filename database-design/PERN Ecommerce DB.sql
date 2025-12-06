CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" "VARCHAR(255)" UNIQUE NOT NULL,
  "first_name" "VARCHAR(100)" NOT NULL,
  "last_name" "VARCHAR(100)" NOT NULL,
  "password_hash" "VARCHAR(255)" NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "user_addresses" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" UUID NOT NULL,
  "full_name" "VARCHAR(200)" NOT NULL,
  "address_label" "VARCHAR(50)",
  "address_line1" "VARCHAR(255)" NOT NULL,
  "address_line2" "VARCHAR(255)",
  "city" "VARCHAR(100)" NOT NULL,
  "state" "VARCHAR(100)" NOT NULL,
  "postal_code" "VARCHAR(20)" NOT NULL,
  "country" "VARCHAR(100)" NOT NULL,
  "phone_number" "VARCHAR(50)" NOT NULL,
  "is_default" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" "VARCHAR(100)" NOT NULL,
  "slug" "VARCHAR(255)" UNIQUE NOT NULL,
  "parent_id" UUID,
  "description" TEXT,
  "image_url" "VARCHAR(255)" NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "products" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "category_id" UUID NOT NULL,
  "title" "VARCHAR(255)" NOT NULL,
  "slug" "VARCHAR(255)" UNIQUE NOT NULL,
  "description" TEXT,
  "base_price" "DECIMAL(10,2)" NOT NULL,
  "original_price" "DECIMAL(10,2)",
  "stock_quantity" INTEGER NOT NULL DEFAULT 0,
  "specifications" JSONB,
  "is_featured" BOOLEAN DEFAULT false,
  "is_active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "product_images" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" UUID NOT NULL,
  "image_url" "VARCHAR(255)" NOT NULL,
  "alt_text" "VARCHAR(255)",
  "display_order" INTEGER DEFAULT 0,
  "is_primary" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "product_variants" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" UUID NOT NULL,
  "variant_name" "VARCHAR(50)" NOT NULL,
  "variant_value" "VARCHAR(50)" NOT NULL,
  "price_adjustment" "DECIMAL(10,2)" DEFAULT 0,
  "stock_quantity" INTEGER DEFAULT 0,
  "image_url" "VARCHAR(255)"
);

CREATE TABLE "carts" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" UUID,
  "session_id" "VARCHAR(255)",
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "cart_items" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "cart_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "variant_id" UUID,
  "quanity" INTEGER NOT NULL DEFAULT 1,
  "added_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "orders" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" UUID NOT NULL,
  "status" "VARCHAR(50)" NOT NULL,
  "total_amount" "DECIMAL(10,2)" NOT NULL,
  "shipping_address_snapshot" JSONB NOT NULL,
  "payment_method" "VARCHAR(50)" NOT NULL,
  "payment_status" "VARCHAR(50)" NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE "order_items" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "order_id" UUID NOT NULL,
  "product_id" UUID,
  "product_snapshot" JSONB NOT NULL,
  "variant_snapshot" "JSOB" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price_at_purchase" "DECIMAL(10,2)" NOT NULL,
  "total_price" "DECIMAL(10,2)" NOT NULL
);

CREATE TABLE "reviews" (
  "id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "is_verified_purchase" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (NOW())
);

COMMENT ON COLUMN "users"."email" IS 'User''s email address (login identifier)';

COMMENT ON COLUMN "users"."password_hash" IS 'Hashed password';

COMMENT ON COLUMN "user_addresses"."address_label" IS 'Optional label (e.g, ''Home'', ''Work'')';

COMMENT ON COLUMN "categories"."parent_id" IS 'Self-referencing FK for subcategories';

COMMENT ON COLUMN "products"."specifications" IS 'Key-value pairs for specs';

COMMENT ON COLUMN "product_variants"."variant_name" IS 'e.g. ''Color'', ''Size''';

COMMENT ON COLUMN "product_variants"."variant_value" IS 'e.g. ''Black'', ''Silver''';

COMMENT ON COLUMN "order_items"."product_snapshot" IS 'Full snapshot of product data';

COMMENT ON COLUMN "order_items"."variant_snapshot" IS 'Full snapshot of selected variant';

COMMENT ON COLUMN "reviews"."rating" IS 'Check: rating >= 1 AND rating <= 5';

ALTER TABLE "user_addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("parent_id") REFERENCES "categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "product_images" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_variants" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("variant_id") REFERENCES "product_variants" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
