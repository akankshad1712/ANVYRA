-- ANVYRA Seed Data

-- ── Categories ────────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description, active) VALUES
  ('Jackets',            'jackets',   'Premium outerwear for every season',        true),
  ('Oversized T-Shirts', 'oversized', 'Relaxed heavyweight streetwear essentials', true),
  ('Shirts',             'shirts',    'Crisp wovens and soft jerseys',             true),
  ('Trousers',           'trousers',  'Tailored drape meets all-day wearability',  true),
  ('Straight-fit Jeans', 'jeans',     'Classic denim, uncompromised',             true)
ON CONFLICT (slug) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────────────────────
INSERT INTO products (name, brand, description, price, discount_price, quantity, active, featured, average_rating, total_reviews, category_id, created_at, updated_at) VALUES

('ANVYRA Obsidian Bomber Jacket','ANVYRA','Structured bomber with premium matte finish. Ribbed cuffs, zip-through design, deep side pockets. Built for the bold.',4999,3999,25,true,true,4.8,0,(SELECT id FROM categories WHERE slug='jackets'),NOW(),NOW()),
('ANVYRA Cobalt Field Jacket','ANVYRA','Utility field jacket in deep cobalt. Four-pocket design, chest straps, relaxed boxy fit.',5499,4499,18,true,true,4.7,0,(SELECT id FROM categories WHERE slug='jackets'),NOW(),NOW()),
('ANVYRA Ivory Varsity Jacket','ANVYRA','Clean ivory on a classic varsity silhouette. Snap buttons, contrast rib trim, relaxed drape.',4799,0,15,true,false,4.5,0,(SELECT id FROM categories WHERE slug='jackets'),NOW(),NOW()),

('ANVYRA Oversized Tee Black','ANVYRA','240 GSM heavyweight cotton. Dropped shoulders, extended back hem, clean chest branding.',1299,999,60,true,true,4.9,0,(SELECT id FROM categories WHERE slug='oversized'),NOW(),NOW()),
('ANVYRA Oversized Tee Ash Grey','ANVYRA','240 GSM heavyweight cotton in warm ash grey. The perfect off-duty essential.',1299,999,55,true,true,4.8,0,(SELECT id FROM categories WHERE slug='oversized'),NOW(),NOW()),
('ANVYRA Oversized Tee Cloud White','ANVYRA','240 GSM heavyweight cotton in clean cloud white. Minimal, versatile, premium.',1299,0,50,true,false,4.6,0,(SELECT id FROM categories WHERE slug='oversized'),NOW(),NOW()),

('ANVYRA Midnight Oxford Shirt','ANVYRA','Premium Oxford weave in midnight black. Button-down collar, chest pocket, slim-straight cut.',2199,1799,40,true,true,4.7,0,(SELECT id FROM categories WHERE slug='shirts'),NOW(),NOW()),
('ANVYRA Sky Chambray Shirt','ANVYRA','Lightweight chambray in soft sky blue. A wardrobe essential that works with everything.',1999,1599,35,true,true,4.6,0,(SELECT id FROM categories WHERE slug='shirts'),NOW(),NOW()),
('ANVYRA Pearl Poplin Shirt','ANVYRA','Crisp pearl white poplin. Spread collar, mother-of-pearl buttons, classic slim fit.',2099,0,30,true,false,4.5,0,(SELECT id FROM categories WHERE slug='shirts'),NOW(),NOW()),

('ANVYRA Coal Tapered Trousers','ANVYRA','Mid-rise tapered cut in deep coal. Four-pocket design, flat front, clean ankle break.',2799,2299,28,true,true,4.8,0,(SELECT id FROM categories WHERE slug='trousers'),NOW(),NOW()),
('ANVYRA Slate Relaxed Trousers','ANVYRA','Relaxed fit in cool slate blue. Elasticated waistband with drawstring, side and back pockets.',2599,2099,32,true,true,4.7,0,(SELECT id FROM categories WHERE slug='trousers'),NOW(),NOW()),
('ANVYRA Blush Wide-Leg Trousers','ANVYRA','Wide-leg silhouette in soft blush. Elevated casual wear that stands out.',2899,0,20,true,false,4.4,0,(SELECT id FROM categories WHERE slug='trousers'),NOW(),NOW()),
('ANVYRA White Linen Trousers','ANVYRA','Breathable linen-blend in clean white. Perfect for summer layering.',2499,1999,22,true,false,4.5,0,(SELECT id FROM categories WHERE slug='trousers'),NOW(),NOW()),

('ANVYRA Raw Straight-Fit Jeans','ANVYRA','12 oz selvedge denim in raw indigo. Straight cut, five-pocket design, button fly.',3499,2999,35,true,true,4.9,0,(SELECT id FROM categories WHERE slug='jeans'),NOW(),NOW()),
('ANVYRA Faded Straight-Fit Jeans','ANVYRA','Classic straight cut in washed faded black. Lived-in look with premium construction.',3299,2799,30,true,true,4.8,0,(SELECT id FROM categories WHERE slug='jeans'),NOW(),NOW());

-- ── Images ────────────────────────────────────────────────────────────────────
INSERT INTO product_images (product_id, image_url) VALUES
((SELECT id FROM products WHERE name='ANVYRA Obsidian Bomber Jacket'),     '/collections/Jackets/black.png'),
((SELECT id FROM products WHERE name='ANVYRA Cobalt Field Jacket'),         '/collections/Jackets/blue.png'),
((SELECT id FROM products WHERE name='ANVYRA Ivory Varsity Jacket'),        '/collections/Jackets/white.png'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Black'),         '/collections/oversize/oversize_black.png'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Ash Grey'),      '/collections/oversize/oversize_grey.png'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Cloud White'),   '/collections/oversize/oversize_white.png'),
((SELECT id FROM products WHERE name='ANVYRA Midnight Oxford Shirt'),       '/collections/shirt/shirt_black.png'),
((SELECT id FROM products WHERE name='ANVYRA Sky Chambray Shirt'),          '/collections/shirt/shirt_b.png'),
((SELECT id FROM products WHERE name='ANVYRA Pearl Poplin Shirt'),          '/collections/shirt/shirt_white.png'),
((SELECT id FROM products WHERE name='ANVYRA Coal Tapered Trousers'),       '/collections/trousers/trouser_black.png'),
((SELECT id FROM products WHERE name='ANVYRA Slate Relaxed Trousers'),      '/collections/trousers/trouser_blue.png'),
((SELECT id FROM products WHERE name='ANVYRA Blush Wide-Leg Trousers'),     '/collections/trousers/trouser_pink.png'),
((SELECT id FROM products WHERE name='ANVYRA White Linen Trousers'),        '/collections/trousers/trouser_white.png'),
((SELECT id FROM products WHERE name='ANVYRA Raw Straight-Fit Jeans'),      '/collections/Straight-fit Jeans/Straight-fit Jeans_blue.png'),
((SELECT id FROM products WHERE name='ANVYRA Faded Straight-Fit Jeans'),    '/collections/Straight-fit Jeans/Straight-fit Jeans_black.png');

-- ── Sizes ─────────────────────────────────────────────────────────────────────
INSERT INTO product_sizes (product_id, size)
SELECT p.id, s FROM products p, unnest(ARRAY['S','M','L','XL','XXL']) s
WHERE p.category_id = (SELECT id FROM categories WHERE slug='jackets');

INSERT INTO product_sizes (product_id, size)
INSERT INTO Product_sizes (product_id, size)
SELECT INTO Product_sizes (product_id, size)
WHERE p.category_id = (SELECT id FROM categories WHERE slug ='jackets');

SELECT INTO product_sizes (product_id, size)

((SELECT id FROM products WHERE name ='ANVYRA White '))








SELECT p.id, s FROM products p, unnest(ARRAY['S','M','L','XL','XXL','3XL']) s
WHERE p.category_id = (SELECT id FROM categories WHERE slug='oversized');

INSERT INTO product_sizes (product_id, size)
SELECT p.id, s FROM products p, unnest(ARRAY['S','M','L','XL','XXL']) s
WHERE p.category_id = (SELECT id FROM categories WHERE slug='shirts');

INSERT INTO product_sizes (product_id, size)
SELECT p.id, s FROM products p, unnest(ARRAY['28','30','32','34','36']) s
WHERE p.category_id = (SELECT id FROM categories WHERE slug IN ('trousers','jeans'));

-- ── Colors ────────────────────────────────────────────────────────────────────
INSERT INTO product_colors (product_id, color) VALUES
((SELECT id FROM products WHERE name='ANVYRA Obsidian Bomber Jacket'),   'Black'),
((SELECT id FROM products WHERE name='ANVYRA Cobalt Field Jacket'),       'Blue'),
((SELECT id FROM products WHERE name='ANVYRA Ivory Varsity Jacket'),      'White'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Black'),       'Black'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Ash Grey'),    'Grey'),
((SELECT id FROM products WHERE name='ANVYRA Oversized Tee Cloud White'), 'White'),
((SELECT id FROM products WHERE name='ANVYRA Midnight Oxford Shirt'),     'Black'),
((SELECT id FROM products WHERE name='ANVYRA Sky Chambray Shirt'),        'Blue'),
((SELECT id FROM products WHERE name='ANVYRA Pearl Poplin Shirt'),        'White'),
((SELECT id FROM products WHERE name='ANVYRA Coal Tapered Trousers'),     'Black'),
((SELECT id FROM products WHERE name='ANVYRA Slate Relaxed Trousers'),    'Blue'),
((SELECT id FROM products WHERE name='ANVYRA Blush Wide-Leg Trousers'),   'Pink'),
((SELECT id FROM products WHERE name='ANVYRA White Linen Trousers'),      'White'),
((SELECT id FROM products WHERE name='ANVYRA Raw Straight-Fit Jeans'),    'Blue'),
((SELECT id FROM products WHERE name='ANVYRA Faded Straight-Fit Jeans'),  'Black');

-- ── Summary ───────────────────────────────────────────────────────────────────
SELECT 'Categories' AS entity, COUNT(*) AS total FROM categories
UNION ALL SELECT 'Products', COUNT(*) FROM products
UNION ALL SELECT 'Images', COUNT(*) FROM product_images
UNION ALL SELECT 'Sizes', COUNT(*) FROM product_sizes
UNION ALL SELECT 'Colors', COUNT(*) FROM product_colors;

