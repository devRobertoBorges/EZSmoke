import { database } from "./config/database.js";

async function testDatabase() {
    try {
        const connection = await database.getConnection();

        console.log("✅ Conexão com MySQL estabelecida!");

        connection.release();
    } catch (error) {
        console.error("❌ Erro ao conectar com MySQL:", error);
    } finally {
        await database.end();
    }
}

testDatabase();