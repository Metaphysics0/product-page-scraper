import { QSTASH_TOKEN } from '$env/static/private';
import { Client } from '@upstash/qstash';

const client = new Client({
	token: QSTASH_TOKEN!
});

export { client };
