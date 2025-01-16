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
        },
        Migration {
            version: 2,
            description: "add prestamos and cuotas tables",
            sql: "
                CREATE TABLE IF NOT EXISTS prestamos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    cliente_id INTEGER NOT NULL,
                    producto TEXT NOT NULL,
                    monto_total REAL NOT NULL,
                    cantidad_cuotas INTEGER NOT NULL,
                    cuotas_pagadas INTEGER DEFAULT 0,
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
                );
                
                CREATE TABLE IF NOT EXISTS cuotas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prestamo_id INTEGER NOT NULL,
                    numero_cuota INTEGER NOT NULL,
                    fecha_vencimiento TEXT NOT NULL,
                    monto_total REAL NOT NULL,
                    monto_pagado REAL DEFAULT 0,
                    estado TEXT NOT NULL,
                    fecha_pago TEXT,
                    FOREIGN KEY (prestamo_id) REFERENCES prestamos(id)
                );
                
                -- Datos de ejemplo para préstamos
                INSERT INTO prestamos (cliente_id, producto, monto_total, cantidad_cuotas, cuotas_pagadas)
                VALUES (1, 'Case Tractor', 15000000, 12, 2);
                
                -- Datos de ejemplo para cuotas
                INSERT INTO cuotas (prestamo_id, numero_cuota, fecha_vencimiento, monto_total, monto_pagado, estado, fecha_pago)
                VALUES 
                    (1, 1, '2024-01-05', 1250000, 1250000, 'pagada', '2024-01-03'),
                    (1, 2, '2024-02-05', 1250000, 1250000, 'pagada', '2024-02-04'),
                    (1, 3, '2024-03-05', 1250000, 0, 'vencida', NULL);
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