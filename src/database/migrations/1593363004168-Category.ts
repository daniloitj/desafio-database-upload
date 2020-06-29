import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn,} from "typeorm";

export class Category1593363004168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name: "categories",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
              generationStrategy: "uuid",
              default: "uuid_generate_v4()",
            },
            {
              name: "title",
              type: "varchar",
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "now()",
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "now()",
            },
          ],
        })
      );

      await queryRunner.createForeignKey(
        "transactions",
        new TableForeignKey({
          name: "TransactionsCategory",
          columnNames: ["category_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "categories",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey("transactions", "TransactionsCategory");
      await queryRunner.dropColumn("transactions", "category_id");
      await queryRunner.addColumn(
        "transactions",
        new TableColumn({
          name: "category_id",
          type: "varchar",
        })
      );
      await queryRunner.dropTable("categories");
    }

}
