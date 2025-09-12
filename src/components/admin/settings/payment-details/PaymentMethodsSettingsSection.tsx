"use client";
import { Button } from "@/components/ui/button";
import { PAYMENT_OPTIONS } from "@/lib/config";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TPaymentDetails, TPaymentMethod } from "@/typings";
import { useAppStore } from "@/lib/store";
import PaymentDetailsItem from "@/components/custom-ui/PaymentDetailsItem";
import AddPaymentDetailsForm from "./AddPaymentDetailsForm";
import UpdatePaymentDetailsForm from "./UpdatePaymentDetailsForm";

function PaymentMethodsSettingsSection() {
  const { currentSettings } = useAppStore();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedDetailsItem, setSelectedDetailsItem] =
    useState<TPaymentDetails | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<TPaymentMethod>();
  const allOptions = currentSettings?.paymentOptions || [];

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4">
        {PAYMENT_OPTIONS.map((item, idx) => {
          const options = allOptions.filter(
            (option) => option.paymentMethod === item.id
          );
          return (
            <div
              key={`payment-option-container-${idx}`}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between">
                <span>{item.label}</span>
                <span className="text-muted-foreground text-sm">
                  Payment Details
                </span>
              </div>
              <div className="flex flex-col flex-1 min-h-[100px] gap-2">
                {options.length > 0 ? (
                  options.map((paymentOption) => {
                    return (
                      <PaymentDetailsItem
                        key={`${item.id}-${paymentOption.id}`}
                        paymentDetails={paymentOption}
                        onEdit={() => {
                          setIsOpenEdit(true);
                          setSelectedDetailsItem(paymentOption);
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="h-[100px] flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">No Details</p>
                  </div>
                )}
              </div>
              <div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpenAdd(true);
                    setSelectedMethod(item.id as TPaymentMethod);
                  }}
                >
                  Add Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={isOpenAdd} onOpenChange={setIsOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Details</DialogTitle>
            <DialogDescription>
              Please double check the right details
            </DialogDescription>
          </DialogHeader>
          {selectedMethod && (
            <AddPaymentDetailsForm
              setClose={() => setIsOpenAdd(false)}
              paymentMethod={selectedMethod}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment Details</DialogTitle>
            <DialogDescription>
              Please double check the right details
            </DialogDescription>
          </DialogHeader>
          {selectedDetailsItem && (
            <UpdatePaymentDetailsForm
              paymentDetails={selectedDetailsItem}
              setClose={() => setIsOpenEdit(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentMethodsSettingsSection;
