create table Cliente
( 
nombre text,
apellidos text,
cedula text,
direccion text,
telefono_trabajo text,
telefono_casa text,
celular text,
correo_personal text,
correo_empresarial text,
ruta text,
constraint pkCliente primary key (cedula) 
);

create table Proyecto
( 
nombreProyecto text,
direccion text,
tipoProyecto text,
tipoObra text,
descripcion text,
fechaInicio text,
fechaFinaliza text,
estado text,
banco text,
cliente text,
ruta text,
constraint pkProyecto primary key (nombreProyecto),
constraint fkCliente foreign key (cliente) references Cliente on update cascade
);


create table Planilla
(
nombre text,
apellidos text,
dni text,
puesto text,
telefono text,
fechaEntrada text,
fechaSalida text,
tipoSalario text,
montoSalario text,
nombreProyecto text,
constraint pkPlanilla primary key (nombreProyecto, dni),
constraint fkProyecto foreign key (nombreProyecto) references Proyecto on update cascade 
);

-- CREATE EXTENSION ltree;

create table Carpeta(
    ruta ltree,
	constraint pkCarpeta primary key (ruta)
)

create table Archivos(
    nombre_archivo text,
    ruta_padre ltree,
    primary key (ruta_padre, nombre_archivo),
    constraint fkCarpeta foreign key (ruta_padre) references Carpeta on update cascade on delete cascade
);

create table Archivos_Cliente(
    nombre_archivo text,
    cedula text,
    primary key (cedula, nombre_archivo),
    constraint fkCliente_Archivos_Cliente foreign key (cedula) references Cliente on update cascade
);

-- create table Carpetas_Papelera(
--     ruta ltree,
--     nombreProyecto text,
--     offspring json[],
--     id bigserial,
--     constraint pk_carpetas_papelera primary key (id),
--     constraint fkProyecto_Carpetas_Papelera foreign key (nombreProyecto) references Proyecto on update cascade
-- );


create table Archivos_Papelera(
    nombre_archivo text,
    ruta_padre ltree,
    nombre_proyecto text,
    id bigserial,
    constraint pk_archivos_papelera primary key (id),
    constraint fkProyecto_Archivos_Papelera foreign key (nombre_proyecto) references Proyecto on update cascade
);

create table Archivos_Cliente_Papelera(
    nombre_archivo text,
    cedula text,
    id bigserial,
    constraint pk_archivos_cliente_papelera primary key (id),
    constraint fkCliente_Archivos_Cliente_Papelera foreign key (cedula) references Cliente on update cascade
);


create table Usuario
( 
nombre text,
apellidos text,
dni text,
direccion text,
telefono text,
correo text,
usuario text,
contrasena text,
isGerente boolean,
fechaEntrada text, 
fechaSalida text, 
tipoSalario text, 
montoSalario text,
constraint pkUsuario primary key (dni) 
);


create table Proveedor
( 
empresa text,
contacto text,
telefono text,
correo text,
producto text,
constraint pkProveedor primary key (empresa) 
);  


create table Historial
(
fecha timestamp,
nombre text,
accion text,
modulo text,
alterado text
);


-- select Update_Folders('Miraflores', 'Miraflores2');
-- CREATE OR REPLACE FUNCTION Update_Folders(tree text, new_tree text) 
-- RETURNS VOID AS $$
-- DECLARE
--     rec RECORD;
--     aux_tree ltree;
-- BEGIN
--     FOR rec IN SELECT * FROM carpeta WHERE ruta <@ text2ltree(tree)
--     LOOP
--         if nlevel(text2ltree(tree)) = nlevel(rec.ruta) then 
--             update carpeta 
--             set ruta = text2ltree(new_tree)
--             where ruta = rec.ruta;	

--         else
--             aux_tree = subltree(rec.ruta, nlevel(text2ltree(tree)) , nlevel(rec.ruta));
--             update carpeta 
--             set ruta = text2ltree(new_tree) || aux_tree
--             where ruta = rec.ruta;
--         end if; 
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;




-- select * from insert_archivos_papelera('{"0":"07. Guia Informe de seguimiento 2018 v2.doc","1":"a123.docx","2":"a222.docx"}',  'userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miraflores.publico', 'Miraflores')
-- CREATE OR REPLACE FUNCTION insert_archivos_papelera(files json, rutapadre text, nombre_proyecto text) 
-- RETURNS integer[] AS $$
-- DECLARE
-- 	rec RECORD;
-- 	idfile integer;
-- 	ids integer[];
--     nombrearchivo text;
--     cont integer;
-- BEGIN
-- 	cont = 1;
-- 	FOR rec IN 	select * from json_each_text(files)
--     LOOP	
--     	nombrearchivo = rec.value;
--         insert into Archivos_Papelera values(nombrearchivo, text2ltree(rutapadre), nombre_proyecto) RETURNING id into idfile;
--         delete from Archivos where ruta_padre = text2ltree(rutapadre) and nombre_archivo = nombrearchivo;
--         ids[cont] = idfile;
--         cont = cont + 1;
--     END LOOP;
--   return ids;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;




-- select * from delete_archivos_papelera(array[102,103])
-- CREATE OR REPLACE FUNCTION delete_archivos_papelera(files integer[]) 
-- RETURNS VOID AS $$
-- DECLARE
-- 	id_file integer;
-- BEGIN
-- 	FOREACH id_file IN ARRAY files
--    	LOOP
--       delete from archivos_papelera where id = id_file;
--    	END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;




-- CREATE OR REPLACE FUNCTION get_offspring(ruta_entrada text) 
-- RETURNS json[] AS $$
-- DECLARE
--     rec RECORD;
--     rec2 RECORD;
--     carpetas json[];
--     carpeta json;
--     files text[];
--     cont integer;
--     sub_cont integer;
-- BEGIN
-- 	cont = 1;
--     FOR rec IN SELECT ruta, nlevel(ruta) FROM carpeta WHERE ruta <@ text2ltree(ruta_entrada) order by nlevel
--     LOOP
--        files = array[]::json[];
--        sub_cont = 1;
--        FOR rec2 IN SELECT nombre_archivo from archivos where ruta_padre = rec.ruta
--        LOOP
--             files[sub_cont] = rec2.nombre_archivo;
--             sub_cont = sub_cont + 1;
--             delete from archivos where ruta_padre = rec.ruta and nombre_archivo = rec2.nombre_archivo;
--         END LOOP; 
--         carpeta = json_build_object('ruta', subltree(rec.ruta,7,nlevel(rec.ruta)),'zfiles', files);
--         carpetas[cont] = carpeta;
--         cont = cont + 1;
--         delete from carpeta where ruta = rec.ruta;
--     END LOOP;
--     return carpetas;
-- END;
-- $$ LANGUAGE plpgsql;



-- select * from delete_carpetas(array['userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miaraflores.publico.costos', 'userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miaraflores.publico.arrow'],'Miaraflores')
-- CREATE OR REPLACE FUNCTION delete_carpetas(folders text[], nombreproyecto text) 
-- RETURNS integer[] AS $$
-- DECLARE
-- 	ruta_carpeta text;
-- 	id_carpeta integer;
--     ids integer[];
--     offspring json[];
--     cont integer;
-- BEGIN
-- 	cont = 1;
-- 	FOREACH ruta_carpeta IN ARRAY folders
--    	LOOP
--       offspring = get_offspring(ruta_carpeta);
--       insert into Carpetas_Papelera values (text2ltree(ruta_carpeta), nombreproyecto, offspring) RETURNING id into id_carpeta;
--       ids[cont] = id_carpeta; 
--       cont = cont + 1;
--    	END LOOP;
--     return ids;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;


-- CREATE OR REPLACE FUNCTION delete_carpetas_papelera(folders integer[]) 
-- RETURNS VOID AS $$
-- DECLARE
-- 	id_folder integer;
-- BEGIN
-- 	FOREACH id_folder IN ARRAY folders
--    	LOOP
--       delete from Carpetas_Papelera where id = id_folder;
--    	END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;



-- select * from recovery_folders('{"0":{"id":23,"update_path":"userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miaraflores"},"1":{"id":24,"update_path":"userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miaraflores"}}')
-- CREATE OR REPLACE FUNCTION recovery_folders(obj json) 
-- RETURNS VOID AS $$
-- DECLARE
--     rec RECORD;
--     rec2 RECORD;
--     rec3 RECORD;
--     id_folder integer;
--     update_path text;
-- BEGIN
--     FOR rec IN SELECT * from json_each(obj)
--     LOOP
--     	FOR rec2 IN SELECT * from json_each(rec.value)
--     	LOOP
--         	if rec2.key = 'id' then
--             	id_folder = rec2.value;
--             elsif rec2.key = 'update_path' then
--                 SELECT * into update_path from substring(rec2.value::text from 2 for length(rec2.value::text)-2);
--             end if;
--     	END LOOP;
--         FOR rec3 IN select offspring from Carpetas_Papelera where id = id_folder
--         LOOP
--         	Perform build_folder(rec3.offspring, update_path);
--         END LOOP;
--         delete from Carpetas_Papelera where id = id_folder;
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;


-- select * from build_folder(array[json_build_object('ruta', 'publico.costos', 'zfiles', array['ax.docx','bx.docx']),
--                             json_build_object('ruta', 'publico.costos.a1', 'zfiles', array['cx.docx']),
--                             json_build_object('ruta', 'publico.costos.a2', 'zfiles', array['dx.docx','ex.docx'])], 
--                       		'userprofile.Documents.SistemaPROARINSA.2018.Mayo.Miaraflores')

-- CREATE OR REPLACE FUNCTION build_folder(obj json[], update_path text) 
-- RETURNS VOID AS $$
-- DECLARE
--     rec json;
--     rec2 RECORD;
--     rec3 RECORD;
--     real_ruta ltree;
--     parse_text text;
--     file_name text;
-- BEGIN
-- 	FOREACH rec IN ARRAY obj
--     LOOP
--     	FOR rec2 IN SELECT * from json_each(rec)
--         LOOP
--         	if rec2.key = 'ruta' then
--             	SELECT * into parse_text from substring(rec2.value::text from 2 for length(rec2.value::text)-2);
--          		real_ruta = text2ltree(update_path) || text2ltree(parse_text); 
--                 insert into carpeta values (real_ruta);
-- 			elsif rec2.key = 'zfiles' then
--             	FOR rec3 IN SELECT * from json_array_elements(rec2.value)
--                 LOOP
--                 	SELECT * into file_name from substring(rec3.value::text from 2 for length(rec3.value::text)-2);
--                     insert into archivos values(file_name, real_ruta);
--                 END LOOP;       	
--         	end if;
--         END LOOP;
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION insert_cliente_archivos_papelera(files json, ced text) 
-- RETURNS integer[] AS $$
-- DECLARE
-- 	rec RECORD;
-- 	idfile integer;
-- 	ids integer[];
--     nombrearchivo text;
--     cont integer;
-- BEGIN
-- 	cont = 1;
-- 	FOR rec IN 	select * from json_each_text(files)
--     LOOP	
--     	nombrearchivo = rec.value;
--         insert into Archivos_Cliente_Papelera values(nombrearchivo, ced) RETURNING id into idfile;
--         delete from Archivos_Cliente where nombre_archivo = nombrearchivo and cedula = ced;
--         ids[cont] = idfile;
--         cont = cont + 1;
--     END LOOP;
--   return ids;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;

-- CREATE OR REPLACE FUNCTION delete_archivos_clientes_papelera(files integer[]) 
-- RETURNS VOID AS $$
-- DECLARE
-- 	id_file integer;
-- BEGIN
-- 	FOREACH id_file IN ARRAY files
--    	LOOP
--       delete from Archivos_Cliente_Papelera where id = id_file;
--    	END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;


-- CREATE OR REPLACE FUNCTION recovery_proyecto_archivos(files json) 
-- RETURNS VOID AS $$
-- DECLARE
-- 	rec RECORD;
--     rec2 RECORD;
-- 	rutapadre text;
--     nombrearchivo text;
--     id_file integer;
-- BEGIN
-- 	FOR rec IN select * from json_array_elements(files)
--     LOOP
--     	FOR rec2 IN select * from json_each_text(rec.value)
--         LOOP	
--             if rec2.key = 'nombre_archivo' then
--                 nombrearchivo = rec2.value;
--             elsif rec2.key = 'ruta_padre' then
--                 rutapadre = rec2.value;
--             elsif rec2.key = 'id' then
--                 id_file = rec2.value;
--             end if;
--         END LOOP;
--         insert into Archivos values(nombrearchivo, text2ltree(rutapadre));
--         delete from Archivos_Papelera where id = id_file;
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;

-- CREATE OR REPLACE FUNCTION delete_folder_permanently(folders text[]) 
-- RETURNS void AS $$
-- DECLARE
-- 	rec Record;
-- 	ruta_carpeta text;
-- BEGIN
-- 	FOREACH ruta_carpeta IN ARRAY folders
--    	LOOP
--       FOR rec IN SELECT ruta, nlevel(ruta) FROM carpeta WHERE ruta <@ text2ltree(ruta_carpeta) order by nlevel
--       LOOP
--       	delete from Carpeta where ruta = rec.ruta;	
--       END LOOP;
--    	END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;


-- select * from update_customer_proyects('[{"nombre_proyecto":"Miraflores5","up":"userprofile.Documents.SistemaPROARINSA.116740551.2018.Mayo.Miraflores5"},{"nombre_proyecto":"Core2","up":"userprofile.Documents.SistemaPROARINSA.116740551.2018.Mayo.Core2"}]')
-- CREATE OR REPLACE FUNCTION update_customer_proyects(info json) 
-- RETURNS VOID AS $$
-- DECLARE
-- 	rec RECORD;
--     rec2 RECORD;
--     nombre_proyecto text;
--     up text;
-- BEGIN
-- 	FOR rec IN select * from json_array_elements(info)
--     LOOP
--     	FOR rec2 IN select * from json_each_text(rec.value)
--         LOOP
--         	if rec2.key = 'nombre_proyecto' then
--                 nombre_proyecto = rec2.value;
--             elsif rec2.key = 'up' then
--                 up = rec2.value;
--             end if;
--         END LOOP;
--         update proyecto set ruta = up where nombreproyecto = nombre_proyecto;
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE;

insert into usuario values('Luis','Carrillo','40232014','Heredia','222222','asd@gmail.com','sub','123',false,'12/03/2015','12/03/2015','mensual','25000');
insert into usuario values('Jerry','Ramirez','11567478','Heredia','112233','asd@gmail.com','admin','admin',true,'12','12','mensual','111');

-- truncate table cliente cascade; 
-- truncate table carpeta cascade;
-- truncate table proveedor;
-- truncate table usuario;
-- truncate table historial;

 