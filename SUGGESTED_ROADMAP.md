# 🚀 Roadmap & Sugerencias de Mejora - Proyecto Seven

Este documento detalla oportunidades de mejora técnica y de experiencia de usuario (UX) identificadas para escalar la aplicación, mejorar su estabilidad y facilitar el mantenimiento futuro.

---

## 🧠 Backend (Node.js + Express)

### 1. Paginación en Listados (Crítico)
*   **Situación Actual:** Endpoints como `/api/articulos` y `/api/pedidos` devuelven *todos* los registros (`getMany()`).
*   **Riesgo:** Con el crecimiento de datos (ej. 5,000 productos), las consultas serán lentas y consumirán demasiada memoria, bloqueando la app.
*   **Sugerencia:** Implementar paginación (offset/limit) en los controladores.
    ```typescript
    // Ejemplo
    const take = 20;
    const skip = (page - 1) * take;
    .take(take).skip(skip)
    ```

### 2. Validación de Datos (Middleware)
*   **Situación Actual:** La validación se hace manualmente dentro de los controladores (`if (!req.body.nombre)...`).
*   **Mejora:** Implementar un middleware de validación (usando librerías como `Zod` o `Joi`). Esto separa la lógica de validación de la lógica de negocio y hace el código más limpio y seguro.

### 3. Logging Profesional
*   **Situación Actual:** Uso de `console.log`.
*   **Mejora:** Integrar **Winston** o **Morgan**. Esto permite guardar logs en archivos, rotarlos diariamente y tener niveles de error (INFO, WARN, ERROR), vital para depurar problemas en producción sin tener la terminal abierta.

### 4. Swagger/OpenAPI Completo
*   **Situación Actual:** Documentación parcial.
*   **Mejora:** Asegurar que *todas* las rutas nuevas (como `/stats`) estén documentadas automáticamente. Esto facilita el trabajo del frontend y futuras integraciones.

---

## 📱 Frontend (App Móvil)

### 1. Gestión de Estado de Servidor (TanStack Query)
*   **Situación Actual:** Manejo manual de caché con `AsyncStorage` + `fetch` en hooks personalizados (`useHomeData`). Lógica compleja de "try/catch" para fallback offline.
*   **Mejora (Alto Impacto):** Migrar a **TanStack Query (React Query)**.
    *   **Por qué:** Maneja automáticamente el caché, la revalidación en segundo plano, los estados de `loading`/`error` y el "deduplicado" de peticiones. Simplificaría drásticamente archivos como `orders.ts` y aseguraría que los datos estén siempre frescos cuando hay red.

### 2. Formularios Robustos (React Hook Form)
*   **Situación Actual:** Uso de `useState` para cada campo (ej. `stock/new.tsx`).
*   **Mejora:** Usar **React Hook Form** + **Zod Resolver**.
    *   **Por qué:** Mejor rendimiento (evita re-renderizados innecesarios al escribir), validación más sencilla y escalable, y manejo fácil de errores en inputs.

### 3. Cola de Sincronización (Offline Queue)
*   **Situación Actual:** Sincronización "al momento" o "al recargar".
*   **Mejora:** Implementar una cola persistente real. Si se crea un pedido offline, este entra en una "cola". Un "worker" en segundo plano debería intentar procesar esa cola cada X minutos o cuando se detecte conexión (usando `NetInfo`), independientemente de si el usuario está en la pantalla de pedidos o no.

### 4. Feedback Háptico
*   **Mejora UX:** Agregar vibraciones sutiles (`expo-haptics`) al realizar acciones clave (guardar exitoso, error, pull-to-refresh). Esto da una sensación de aplicación nativa "premium".

---

## 🎨 UI/UX Design

### 1. Sistema de Diseño (Tokens)
*   **Sugerencia:** Centralizar no solo colores, sino tamaños de fuente, espaciados y sombras en `constants/theme.ts`. Usar estos tokens en lugar de valores duros (ej. `padding: 16` -> `padding: SPACING.md`).

### 2. Componentes de Lista Vacía (Empty States)
*   **Sugerencia:** Mejorar visualmente cuando no hay datos (ej. "No tienes pedidos aún"). Usar ilustraciones vectoriales amigables en lugar de texto plano.

### 3. Skeleton Loading Generalizado
*   **Sugerencia:** Crear un componente `<SkeletonLoader />` genérico y flexible que se pueda usar en cualquier pantalla, para no tener que crear un `OrderSkeleton`, `ProductSkeleton`, etc., por separado, reduciendo duplicidad de código.
