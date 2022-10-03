#!/usr/bin/env bash

until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do 
    sleep 5;
    echo "Waiting for cassandra...";
done

echo "Creating keyspace and table..."
cqlsh cassandra -u cassandra -p cassandra -e "CREATE KEYSPACE IF NOT EXISTS place WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1': 1};"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE IF NOT EXISTS place.canvas ( name text, x INT, y INT, color INT, last_update TIMESTAMP, PRIMARY KEY ((name, x, y)));"