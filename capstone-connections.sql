-- to create both databases at command line and seed the production db, run
--    "$ createdb capstone_connections"
---   "$ createdb capstone_connections_test"
--    "$ psql < capstone-connections.sql"

\echo 'Delete and recreate capstone_connections db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS capstone_connections;
CREATE DATABASE capstone_connections;
\connect capstone_connections

\i schema.sql
\i seed.sql