﻿using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using EastBarley.Models;
using Dapper;

namespace EastBarley.DataAccess
{
    public class InvoicesRepository
    {
        string ConnectionString;
        public InvoicesRepository(IConfiguration config)
        {
            ConnectionString = config.GetConnectionString("EastBarley");
        }

        public IEnumerable<Invoices> GetAllInvoices()
        {
            using (var db = new SqlConnection(ConnectionString))
            {
                return db.Query<Invoices>("SELECT * FROM Invoice");
            }
        }


        public IEnumerable<Invoices> GetInvoicesByUserId(int userId)
        {
            var sql = @"SELECT *
                        FROM Invoice
                        WHERE UserId = @userId";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { UserId = userId };
                var result = db.Query<Invoices>(sql, parameters);
                return result;
            }
        }

        public IEnumerable<Invoices> GetInvoicesByInvoiceId(int invoiceId)
        {
            var sql = @"SELECT *
                        FROM Invoice
                        WHERE InvoiceId = @invoiceId";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { InvoiceId = invoiceId };
                var result = db.Query<Invoices>(sql, parameters);
                return result;
            }
        }

        public IEnumerable<Invoices> GetInvoicesByStateAbbr(string billingState)
        {
            var sql = @"SELECT *
                        FROM Invoice
                        WHERE BillingState = @billingState";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { BillingState = billingState };
                var result = db.Query<Invoices>(sql, parameters);
                return result;
            }
        }

        public IEnumerable<PaymentTypes> GetPaymentTypesByUser(int userId)
        {
            var sql = @"SELECT *
                        FROM Payments
                        WHERE UserId = @userId
                        AND isActive = 1";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { UserId = userId };
                var result = db.Query<PaymentTypes>(sql, parameters);
                return result;
            }
        }

        public PaymentTypes AddPaymentType(PaymentTypes paymentToAdd)
        {
            var sql = @"Insert into Payments([UserId], PaymentType, AccountNumber, ExpirationYear, ExpirationMonth, isActive)
                            output inserted.*
		                        values(@UserId, @PaymentType, @AccountNumber, @ExpirationYear, @ExpirationMonth, @isActive)";

            using (var db = new SqlConnection(ConnectionString))
            {
                var result = db.QueryFirstOrDefault<PaymentTypes>(sql, paymentToAdd);
                return result;
            }
        }

        public int DeactivatePaymentMethod(int paymentId)
        {
            var sql = @"Update Payments
                            set isActive = 0
		                        where Payments.PaymentId = @paymentId";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { paymentId = paymentId };
                var result = db.Execute(sql, parameters);
                return result;
            }
        }

        public OrderCart CheckForCart(int userId)
        {
            var sql = @"select UserId, TotalCost, StatusId
                                 from Invoice
                                 where UserId = @userId";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { UserId = userId };
                var result = db.QueryFirstOrDefault<OrderCart>(sql, parameters);
                return result;
            }
        }

        public OrderCart StartNewOrder(int userId, decimal totalCost)
        {
            var sql = @"insert into Invoice(UserId, TotalCost, StatusId)
                        output inserted.*
                        values(@userId, @totalCost, 1)";

            using (var db = new SqlConnection(ConnectionString))
            {
                var parameters = new { UserId = userId, TotalCost = totalCost };
                var result = db.QueryFirstOrDefault<OrderCart>(sql, parameters);
                return result;
            }
        }

        public LineItems AddLineItem(LineItems lineItemToAdd)
        {
            var sql = @"insert into LineItems(ProductId, InvoiceId, Price, Quantity)
                                output inserted.*
                                values(@productId, @invoiceId, @price, @quantity)";

            using (var db = new SqlConnection(ConnectionString))
            {
                var result = db.QueryFirstOrDefault<LineItems>(sql, lineItemToAdd);
                return result;
            }
        }

        public OrderCart AddToExistingCart(int invoiceId, decimal totalCost)
        {
            throw new NotImplementedException();
        }

    }
}
