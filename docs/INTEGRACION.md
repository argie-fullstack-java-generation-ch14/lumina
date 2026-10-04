# Estrategia de Ramas y Flujo de Integración (Pull Requests)

Para mantener la estabilidad y calidad de la rama principal (`main`), todos los cambios se integrarán exclusivamente mediante **Pull Requests (PR)** en GitHub.

---

## 1. Flujo del Desarrollador (Creación del Pull Request)

Cuando hayas finalizado una tarea o funcionalidad en tu máquina local, sigue estos pasos:

1. **Subir cambios a GitHub:** Haz push de tu rama local a la rama remota correspondiente en GitHub.
2. **Navegar a GitHub:** Ve al repositorio del proyecto en GitHub y dirígete a la pestaña **Pull requests**.
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-1.png)
3. **Crear el Pull Request:**
   * Haz clic en **New pull request**.
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-2.png)
   * Selecciona la rama origen (tu rama de trabajo) y la rama destino (`main`).
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-3.png)
4. **Completar la información:**
   * **Título y Descripción:** Escribe una descripción breve pero clara explicando qué cambios, correcciones o funcionalidades estás integrando a `main`.
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-4.png)
   * **Asignar Revisor (Code Reviewer):** Selecciona al compañero(a) de equipo responsable de revisar tu código.
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-5.png)
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-6.png)
   * Crear el Pull Request
   ![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-7.png)

---

## 2. Resolución de Conflictos
Si GitHub indica que tu Pull Request tiene conflictos con la rama `main` que impiden el merge automático:

![Haz clic en **New pull request**.](./FLUJO%20PRS/paso-8.png)

> ⚠️ **IMPORTANTE (Primera vez que ocurra un conflicto):**  
> Cuando se presente un conflicto por primera vez en el proyecto, no te alarmes, los conflictos son parte habitual del trabajo en equipo incluso en un entorno laborar real. Como estamos en proceso de aprendizaje, avisa al equipo en cuanto ocurra. Realizaremos una sesión en vivo para revisar el paso a paso para su resolución. El objetivo de esa sesió es que todos nos familiaricemos con la dinámica descrita a continuación y la tomemos como guía para resolver futuros conflictos de forma autónoma.

### Pasos para resolver conflictos localmente:

1. **Asegúrate de estar en tu rama local de trabajo:**
   ```bash
   git checkout tu-rama
   ```

2. **Trae los cambios más recientes de `main`:**
   ```bash
   git fetch origin
   git merge origin/main
   ```

3. **Identifica y abre los archivos en conflicto** en tu editor de código (VS Code o similar).

4. **Elige los cambios correctos** que deben permanecer y elimina los marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).

5. **Guarda los archivos modificados y confirma la resolución:**
   ```bash
   git add .
   git commit -m "fix: resolviendo conflictos con main"
   ```

6. **Sube la actualización a tu rama remota:**
   ```bash
   git push origin tu-rama
   ```

El Pull Request en GitHub se actualizará automáticamente y mostrará que los conflictos fueron resueltos.

---

## 3. Rol del Revisor de Código (Code Reviewer)

La persona asignada como revisor debe seguir este flujo:

1. Ir a la pestaña **Pull requests** en GitHub y seleccionar el PR asignado.
2. Leer la descripción enviada por el autor para entender el contexto de los cambios.
3. Ir a la pestaña **Files changed** para inspeccionar el código:
   * **Si hay observaciones o sugerencias:** Dejar los comentarios pertinentes directamente en la línea de código o en la discusión general del PR.
   * **Si todo está correcto:** Seleccionar la opción **Approve** (Aprobar).
4. Realizar el **Merge pull request** para integrar los cambios a `main`.

---

📌 **Convención de Ramas:**  
*No eliminar las ramas después de realizar el merge. Mantendremos el historial de ramas en GitHub según la convención del equipo.*
