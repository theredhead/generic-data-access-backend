# data-access API

Presents a simple RESTfull API that exposes a mysql database over HTTP.

- [data-access API](#data-access-api)
  - [Conventions](#conventions)
  - [Defined routes](#defined-routes)
    - [/api/data-access/table/:table/info, GET](#apidata-accesstabletableinfo-get)
    - [/api/data-access/table/:table, GET](#apidata-accesstabletable-get)
    - [/api/data-access/table/:table, POST](#apidata-accesstabletable-post)
    - [/api/data-access/table/:table/record/:id, GET](#apidata-accesstabletablerecordid-get)
    - [/api/data-access/table/:table/record/:id/column/:column, GET](#apidata-accesstabletablerecordidcolumncolumn-get)
    - [/api/data-access/table/:table/record/:id/column/:column, PATCH](#apidata-accesstabletablerecordidcolumncolumn-patch)
    - [/api/data-access/table/:table/record/:id, PUT](#apidata-accesstabletablerecordid-put)
    - [/api/data-access/table/:table/record/:id, DELETE](#apidata-accesstabletablerecordid-delete)
    - [/api/data-access/table/:table, POST](#apidata-accesstabletable-post-1)

## Conventions

This API is designed to work with tables that have a numeric id column as their primary key. It is intended for development situations.

Important types:

```typescript

  interface Record {
    id?: number;
    [field: string]: any;
  }

  interface RecordSet {
    info?: any;
    fields?: any[];
    rows: Record[];
  }

```

Because this is a generic API, there are no strictly defined DTO types per table, all records of all tables are dealt with in terms of the `Record` interface.

- Records that have not been inserted yet should not have an `id` property.
- If you try to inssert a record that has an `id` property, it is ignored.
- if you update a record using the API, it's `id` property is ignored and the `id` given on the url is used to update the record.


## Defined routes
### /api/data-access/table/:table/info, GET

Get schema information about a table

### /api/data-access/table/:table, GET

Get a page of table content. optionally takes pageIndex and pageSize from the Querystring

### /api/data-access/table/:table, POST

Creates a record

### /api/data-access/table/:table/record/:id, GET

Gets a singe record

### /api/data-access/table/:table/record/:id/column/:column, GET

Gets the value of a single column

### /api/data-access/table/:table/record/:id/column/:column, PATCH

Updates a single column of a single record

### /api/data-access/table/:table/record/:id, PUT

Updates a record

### /api/data-access/table/:table/record/:id, DELETE

Deletes a record (there is no bulk delete)
### /api/data-access/table/:table, POST

Creates a table