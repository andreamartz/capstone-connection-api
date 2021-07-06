-- to create both databases at command line and seed the production db, run
--    "$ createdb capstone_connections"
---   "$ createdb capstone_connections_test"
--    "$ psql < capstone-connections.sql"


\echo 'Delete and recreate capstone_connections_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS capstone_connections_test;
CREATE DATABASE capstone_connections_test;
\connect capstone_connections_test

\i schema.sql