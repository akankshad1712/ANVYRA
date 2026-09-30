# ANVYRA Database Seed Script
$BASE = "http://localhost:8080/api"

Write-Host "[1/4] Authenticating..." -ForegroundColor Cyan
$adminBody = '{"firstName":"Admin","lastName":"ANVYRA","email":"admin@anvyra.com","password":"Admin@12345","phoneNumber":"9999999999"}'
try {
    $r = Invoke-RestMethod -Uri "$BASE/auth/register" -Method POST -ContentType "application/json" -Body $adminBody
    $TOKEN = $r.accessToken
    Write-Host "  Admin registered." -ForegroundColor Green
} catch {
    $loginBody = '{"email":"admin@anvyra.com","password":"Admin@12345"}'
    $r = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $TOKEN = $r.accessToken
    Write-Host "  Admin login OK." -ForegroundColor Green
}

$H = @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" }

Write-Host "[2/4] Creating categories..." -ForegroundColor Cyan
$catDefs = @(
    @{ name="Jackets";            description="Premium outerwear for every season";       slug="jackets"   },
    @{ name="Oversized T-Shirts"; description="Relaxed streetwear essentials";            slug="oversized" },
    @{ name="Shirts";             description="Crisp wovens and soft jerseys";            slug="shirts"    },
    @{ name="Trousers";           description="Tailored drape meets all-day wearability"; slug="trousers"  },
    @{ name="Straight-fit Jeans"; description="Classic denim, uncompromised";            slug="jeans"     }
)
$catIds = @{}
foreach ($c in $catDefs) {
    try {
        $res = Invoke-RestMethod -Uri "$BASE/categories" -Method POST -Headers $H -Body ($c | ConvertTo-Json)
        $catIds[$c.slug] = $res.id
        Write-Host "  Created $($c.name) id=$($res.id)" -ForegroundColor Green
    } catch {
        $all = Invoke-RestMethod -Uri "$BASE/categories" -Method GET
        $found = $all | Where-Object { $_.name -eq $c.name }
        if ($found) { $catIds[$c.slug] = $found.id; Write-Host "  Exists $($c.name) id=$($found.id)" -ForegroundColor Yellow }
    }
}

Write-Host "[3/4] Seeding products..." -ForegroundColor Cyan
$products = @(
    @{ name="ANVYRA Obsidian Bomber Jacket";        brand="ANVYRA"; desc="Structured bomber with premium matte finish. Ribbed cuffs, zip-through design, deep side pockets. Built for the bold.";          price=4999; disc=3999; qty=25; feat=$true;  cat="jackets";   sizes=@("S","M","L","XL","XXL");            colors=@("Black");          imgs=@("/collections/Jackets/black.png") },
    @{ name="ANVYRA Cobalt Field Jacket";           brand="ANVYRA"; desc="Utility field jacket in deep cobalt. Four-pocket design, chest straps, relaxed boxy fit.";                                        price=5499; disc=4499; qty=18; feat=$true;  cat="jackets";   sizes=@("S","M","L","XL");                  colors=@("Blue");           imgs=@("/collections/Jackets/blue.png") },
    @{ name="ANVYRA Ivory Varsity Jacket";          brand="ANVYRA"; desc="Clean ivory on a classic varsity silhouette. Snap buttons, contrast rib trim, relaxed drape.";                                    price=4799; disc=0;    qty=15; feat=$false; cat="jackets";   sizes=@("S","M","L","XL","XXL");            colors=@("White","Ivory"); imgs=@("/collections/Jackets/white.png") },

    @{ name="ANVYRA Oversized Tee Black";           brand="ANVYRA"; desc="240 GSM heavyweight cotton. Dropped shoulders, extended back hem, clean chest branding. The go-to layering piece.";               price=1299; disc=999;  qty=60; feat=$true;  cat="oversized"; sizes=@("S","M","L","XL","XXL","3XL");      colors=@("Black");          imgs=@("/collections/oversize/oversize_black.png") },
    @{ name="ANVYRA Oversized Tee Ash Grey";        brand="ANVYRA"; desc="240 GSM heavyweight cotton in warm ash grey. The perfect off-duty essential.";                                                     price=1299; disc=999;  qty=55; feat=$true;  cat="oversized"; sizes=@("S","M","L","XL","XXL","3XL");      colors=@("Grey","Ash");    imgs=@("/collections/oversize/oversize_grey.png") },
    @{ name="ANVYRA Oversized Tee Cloud White";     brand="ANVYRA"; desc="240 GSM heavyweight cotton in clean cloud white. Minimal, versatile, premium.";                                                   price=1299; disc=0;    qty=50; feat=$false; cat="oversized"; sizes=@("S","M","L","XL","XXL");            colors=@("White");          imgs=@("/collections/oversize/oversize_white.png") },

    @{ name="ANVYRA Midnight Oxford Shirt";         brand="ANVYRA"; desc="Premium Oxford weave in deep midnight black. Button-down collar, chest pocket, slim-straight cut. Dress up or down.";             price=2199; disc=1799; qty=40; feat=$true;  cat="shirts";    sizes=@("S","M","L","XL","XXL");            colors=@("Black");          imgs=@("/collections/shirt/shirt_black.png") },
    @{ name="ANVYRA Sky Chambray Shirt";            brand="ANVYRA"; desc="Lightweight chambray in soft sky blue. A wardrobe essential that works with everything.";                                          price=1999; disc=1599; qty=35; feat=$true;  cat="shirts";    sizes=@("S","M","L","XL");                  colors=@("Blue","Sky");    imgs=@("/collections/shirt/shirt_b.png") },
    @{ name="ANVYRA Pearl Poplin Shirt";            brand="ANVYRA"; desc="Crisp pearl white poplin. Spread collar, mother-of-pearl buttons, classic slim fit.";                                             price=2099; disc=0;    qty=30; feat=$false; cat="shirts";    sizes=@("S","M","L","XL","XXL");            colors=@("White","Pearl"); imgs=@("/collections/shirt/shirt_white.png") },

    @{ name="ANVYRA Coal Tapered Trousers";         brand="ANVYRA"; desc="Mid-rise tapered cut in deep coal. Four-pocket design, flat front, clean break at ankle.";                                        price=2799; disc=2299; qty=28; feat=$true;  cat="trousers";  sizes=@("28","30","32","34","36");           colors=@("Black","Coal");  imgs=@("/collections/trousers/trouser_black.png") },
    @{ name="ANVYRA Slate Relaxed Trousers";        brand="ANVYRA"; desc="Relaxed fit in cool slate blue. Elasticated waistband with drawstring, side and back pockets.";                                   price=2599; disc=2099; qty=32; feat=$true;  cat="trousers";  sizes=@("28","30","32","34","36");           colors=@("Blue","Slate");  imgs=@("/collections/trousers/trouser_blue.png") },
    @{ name="ANVYRA Blush Wide-Leg Trousers";       brand="ANVYRA"; desc="Wide-leg silhouette in soft blush. Elevated casual wear that stands out.";                                                         price=2899; disc=0;    qty=20; feat=$false; cat="trousers";  sizes=@("28","30","32","34");               colors=@("Pink","Blush");  imgs=@("/collections/trousers/trouser_pink.png") },
    @{ name="ANVYRA White Linen Trousers";          brand="ANVYRA"; desc="Breathable linen-blend in clean white. Perfect for summer layering.";                                                              price=2499; disc=1999; qty=22; feat=$false; cat="trousers";  sizes=@("28","30","32","34","36");           colors=@("White");          imgs=@("/collections/trousers/trouser_white.png") },

    @{ name="ANVYRA Raw Straight-Fit Jeans";        brand="ANVYRA"; desc="12 oz selvedge denim in raw indigo. Straight cut, five-pocket design, button fly. Timeless quality.";                             price=3499; disc=2999; qty=35; feat=$true;  cat="jeans";     sizes=@("28","30","32","34","36");           colors=@("Blue","Indigo"); imgs=@("/collections/Straight-fit Jeans/Straight-fit Jeans_blue.png") },
    @{ name="ANVYRA Faded Straight-Fit Jeans";      brand="ANVYRA"; desc="Classic straight cut in washed faded black. Lived-in look with premium construction.";                                            price=3299; disc=2799; qty=30; feat=$true;  cat="jeans";     sizes=@("28","30","32","34","36");           colors=@("Black","Faded"); imgs=@("/collections/Straight-fit Jeans/Straight-fit Jeans_black.png") }
)

$created = 0
foreach ($p in $products) {
    $catId = $catIds[$p.cat]
    if (-not $catId) { Write-Host "  SKIP (no catId): $($p.name)" -ForegroundColor Red; continue }
    $body = @{
        name          = $p.name
        brand         = $p.brand
        description   = $p.desc
        price         = $p.price
        discountPrice = $p.disc
        quantity      = $p.qty
        featured      = $p.feat
        active        = $true
        categoryId    = $catId
        sizes         = $p.sizes
        colors        = $p.colors
        images        = $p.imgs
    } | ConvertTo-Json -Depth 4
    try {
        $null = Invoke-RestMethod -Uri "$BASE/products" -Method POST -Headers $H -Body $body
        $created++
        $pstr = if ($p.disc -gt 0) { "Rs.$($p.disc) (was Rs.$($p.price))" } else { "Rs.$($p.price)" }
        Write-Host "  OK: $($p.name) @ $pstr" -ForegroundColor Green
    } catch {
        Write-Host "  FAIL: $($p.name) - $_" -ForegroundColor Red
    }
}
Write-Host "[4/4] Done! $created products seeded." -ForegroundColor Cyan
Write-Host "Open http://localhost:3000/shop" -ForegroundColor White
