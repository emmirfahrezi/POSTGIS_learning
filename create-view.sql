CREATE OR REPLACE VIEW "Location_View_Debug" AS SELECT id, "userId", name, address, ST_AsText(geom) AS geom_wkt, "createdAt", "updatedAt" FROM "Location";  
