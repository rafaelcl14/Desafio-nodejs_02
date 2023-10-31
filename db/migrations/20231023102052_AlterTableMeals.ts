import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.string('user_id')
        table.foreign('user_id').references('id').inTable('user')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.dropForeign('user_id')
    })
}

