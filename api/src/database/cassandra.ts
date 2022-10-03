import * as cassandra from 'cassandra-driver';

const getContactPoint = (): Array<string> => {
  return (process.env.CASSANDRA_CONTACT_POINTS || '0.0.0.0').split(',');
}

const client = new cassandra.Client({
  contactPoints: getContactPoint(),
  localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER|| 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'place'
});

export default client;