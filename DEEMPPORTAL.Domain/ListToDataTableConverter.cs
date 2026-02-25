using System.Data;
using System.Reflection;

namespace DEEMPPORTAL.Domain;

public class ListToDataTableConverter
{
	public static DataTable ToDataTable<T>(T items)
	{
		DataTable dataTable = new(typeof(T).Name);

		// Get all the properties of the model
		PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		// populate the datatable with data from the model objects
		DataRow row = dataTable.NewRow();

		foreach (PropertyInfo property in properties)
		{
			var value = property.GetValue(items, null);
			row[property.Name] = value ?? DBNull.Value;
		}

		dataTable.Rows.Add(row);

		return dataTable;
	}

	public static DataTable ToDataTable<T>(T items, List<string> excludedProperties)
	{
		DataTable dataTable = new(typeof(T).Name);

		// Get all the properties of the model
		PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in properties)
		{
			if (excludedProperties.Contains(property.Name))
				continue;

			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		// populate the datatable with data from the model objects
		DataRow row = dataTable.NewRow();

		foreach (PropertyInfo property in properties)
		{
			if (excludedProperties.Contains(property.Name))
				continue;

			var value = property.GetValue(items, null);
			row[property.Name] = value ?? DBNull.Value;
		}

		dataTable.Rows.Add(row);

		return dataTable;
	}

	public static DataTable ToDataTable<T>(IEnumerable<T> items, List<string> excludedProperties)
	{
		DataTable dataTable = new DataTable(typeof(T).Name);

		// Get all the properties of the model
		PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in properties)
		{
			if (excludedProperties.Contains(property.Name))
				continue;

			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		// populate the datatable with data from the model objects
		foreach (T item in items)
		{
			DataRow row = dataTable.NewRow();
			foreach (PropertyInfo property in properties)
			{
				if (excludedProperties.Contains(property.Name))
					continue;

				var value = property.GetValue(items, null);
				row[property.Name] = value ?? DBNull.Value;
			}
			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

	public static DataTable ToDataTable<T>(IEnumerable<T> items)
	{
		DataTable dataTable = new(typeof(T).Name);

		// Get all the properties of the model
		PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		// populate the datatable with data from the model objects
		foreach (T item in items)
		{
			DataRow row = dataTable.NewRow();
			foreach (PropertyInfo property in properties)
			{
				var value = property.GetValue(item, null);
				row[property.Name] = value ?? DBNull.Value;
			}
			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

	public static DataTable ToDataTable<T>(List<T> items)
	{
		DataTable dataTable = new(typeof(T).Name);

		// Get all the properties of the model
		PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		// populate the datatable with data from the model objects
		foreach (T item in items)
		{
			DataRow row = dataTable.NewRow();
			foreach (PropertyInfo property in properties)
			{
				object value = property.GetValue(item, null);
				row[property.Name] = value ?? DBNull.Value;
			}
			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

	public static DataTable ToDataTable<T, U>(T item1, IEnumerable<U> item2)
	{
		DataTable dataTable = new(typeof(T).Name + "_" + typeof(U).Name);

		// Get all the properties of the model
		PropertyInfo[] item1Properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
		PropertyInfo[] item2Properties = typeof(U).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in item1Properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (PropertyInfo property in item2Properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (U property2 in item2)
		{
			DataRow row = dataTable.NewRow();

			foreach (PropertyInfo property in item1Properties)
			{
				row[property.Name] = property.GetValue(item1, null);
			}

			foreach (PropertyInfo property in item2Properties)
			{
				row[property.Name] = property.GetValue(property2, null);
			}

			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

	public static DataTable ToDataTable<T, U>(IEnumerable<T> item1, U item2)
	{
		DataTable dataTable = new(typeof(T).Name + "_" + typeof(U).Name);

		// Get all the properties of the model
		PropertyInfo[] item1Properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
		PropertyInfo[] item2Properties = typeof(U).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in item1Properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (PropertyInfo property in item2Properties)
		{
			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (T property2 in item1)
		{
			DataRow row = dataTable.NewRow();

			foreach (PropertyInfo property in item1Properties)
			{
				row[property.Name] = property.GetValue(item1, null);
			}

			foreach (PropertyInfo property in item2Properties)
			{
				row[property.Name] = property.GetValue(property2, null);
			}

			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

	public static DataTable ToDataTable<T, U>(T item1, IEnumerable<U> item2, List<string> excludedProperties)
	{
		DataTable dataTable = new(typeof(T).Name + "_" + typeof(U).Name);

		// Get all the properties of the model
		PropertyInfo[] item1Properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
		PropertyInfo[] item2Properties = typeof(U).GetProperties(BindingFlags.Public | BindingFlags.Instance);

		foreach (PropertyInfo property in item1Properties)
		{
			if (excludedProperties.Contains(property.Name))
				continue;

			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (PropertyInfo property in item2Properties)
		{
			if (excludedProperties.Contains(property.Name))
				continue;

			Type propType = property.PropertyType;

			// Handle nullable types 
			if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
			{
				propType = Nullable.GetUnderlyingType(propType);
			}

			dataTable.Columns.Add(property.Name, propType);
		}

		foreach (U property2 in item2)
		{
			DataRow row = dataTable.NewRow();

			foreach (PropertyInfo property in item1Properties)
			{
				if (excludedProperties.Contains(property.Name))
					continue;

				row[property.Name] = property.GetValue(item1, null);
			}

			foreach (PropertyInfo property in item2Properties)
			{
				if (excludedProperties.Contains(property.Name))
					continue;

				row[property.Name] = property.GetValue(property2, null);
			}

			dataTable.Rows.Add(row);
		}

		return dataTable;
	}

}
