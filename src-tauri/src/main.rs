use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create initial tables",
            sql: "
                CREATE TABLE IF NOT EXISTS clientes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    dni TEXT NOT NULL UNIQUE,
                    empresa TEXT,
                    producto TEXT,
                    monto REAL,
                    estado TEXT,
                    fechaSolicitud TEXT
                );
                
                CREATE TABLE IF NOT EXISTS movimientos_caja (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fecha TEXT NOT NULL,
                    tipo TEXT NOT NULL,
                    concepto TEXT,
                    monto REAL NOT NULL,
                    saldo REAL NOT NULL
                );
                
                INSERT INTO clientes (nombre, dni, empresa, producto, monto, estado, fechaSolicitud)
                VALUES
                    ('Juan Pérez', '12345678', 'Empresa A', 'Crédito Personal', 50000.00, 'Aprobado', '2025-01-01'),
                    ('María López', '23456789', 'Empresa B', 'Hipoteca', 200000.00, 'Pendiente', '2025-01-10'),
                    ('Carlos Sánchez', '34567890', 'Freelance', 'Leasing Vehicular', 30000.00, 'Rechazado', '2025-01-15');
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:gp-capital.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}