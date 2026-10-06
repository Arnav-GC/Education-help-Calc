name = input("hello, what is your name? ")
print ("Please put none, once you run out of Subjects and put 0 in Marks")

marks = []
Totalril = []

totalMA = str(input("Are the Total Marks of Each Subject Same?(yes/no): "))
totalMAL = (totalMA.lower())

if totalMAL == "yes":
    howm = int (input ("how much is the total for each subject?: "))

S1 = str (input("name of subject 1: "))
marks1 = int(input("marks of subject 1?: "))
if marks1 != 0:
    marks.append (marks1)
    if totalMAL == "no":
        Total1 = int(input ("what is the total marks of this subject?: "))
        Totalril.append (Total1)
    if totalMAL == "yes":
        if howm < marks1:
          raise ValueError ("you have entered it wrong")
    else:
        if Total1 < marks1:
            raise ValueError ("you have entered it wrong")

    S2 = str (input("name of subject 2: "))
    marks2 = int(input("marks of subject 2?: "))
    if marks2 != 0:
        marks.append (marks2)
        if totalMAL == "no":
            Total2 = int(input ("what is the total marks of this subject?: "))
            Totalril.append (Total2)
        if totalMAL == "yes":
            if howm < marks2:
                raise ValueError ("you have entered it wrong")
        else:
            if Total2 < marks2:
                raise ValueError ("you have entered it wrong")
   
        S3 = str (input("name of subject 3: "))
        marks3 = int(input("marks of subject  3?: "))
        if marks3 != 0:
            marks.append (marks3)
            if totalMAL == "no":
                Total3 = int(input ("what is the total marks of this subject?: "))
                Totalril.append (Total3)
            if totalMAL == "yes":
                if howm < marks3:
                    raise ValueError ("you have entered it wrong")
            else:
                if Total3 < marks3:
                    raise ValueError ("you have entered it wrong")
            
            S4 = str (input("name of subject  4: "))
            marks4 = int(input("marks of subject 4?: "))
            if marks4 != 0:
                marks.append (marks4)
                if totalMAL == "no":
                    Total4 = int(input ("what is the total marks of this subject?: "))
                    Totalril.append (Total4)
                if totalMAL == "yes":
                    if howm < marks4:
                        raise ValueError ("you have entered it wrong")
                else:
                    if Total4 < marks4:
                        raise ValueError ("you have entered it wrong")
            
                S5 = str (input("name of subject  5: "))
                marks5 = int(input("marks of subject 5?: "))
                if marks5 != 0:
                    marks.append (marks5)
                    if totalMAL == "no":
                        Total5 = int(input ("what is the total marks of this subject?: "))
                        Totalril.append (Total5)
                    if totalMAL == "yes":
                        if howm < marks5:
                            raise ValueError ("you have entered it wrong")
                    else:
                        if Total5 < marks5:
                            raise ValueError ("you have entered it wrong")
                
                    S6 = str (input("name of subject  6: "))
                    marks6 = int(input("marks of subject 6?: "))
                    if marks6 != 0:
                        marks.append (marks6)
                        if totalMAL == "no":
                            Total6 = int(input ("what is the total marks of this subject?: "))
                            Totalril.append (Total6)
                        if totalMAL == "yes":
                            if howm < marks6:
                                raise ValueError ("you have entered it wrong")
                        else:
                            if Total6 < marks6:
                                raise ValueError ("you have entered it wrong")
                    
                        S7 = str (input("name of subject  7: "))
                        marks7 = int(input("marks of subject 7?: "))
                        if marks7 != 0:
                            marks.append (marks7)
                            if totalMAL == "no":
                                Total7 = int(input ("what is the total marks of this subject?: "))
                                Totalril.append (Total7)
                            if totalMAL == "yes":
                                if howm < marks7:
                                    raise ValueError ("you have entered it wrong")
                            else:
                                if Total7 < marks7:
                                    raise ValueError ("you have entered it wrong")

                            S8 = str (input("name of subject  8: "))
                            marks8 = int(input("marks of subject 8?: "))
                            if marks8 != 0:
                                marks.append (marks8)
                                if totalMAL == "no":
                                    Total8 = int(input ("what is the total marks of this subject?: "))
                                    Totalril.append (Total8)
                                if totalMAL == "yes":
                                    if howm < marks8:
                                        raise ValueError ("you have entered it wrong")
                                else:
                                    if Total8 < marks8:
                                        raise ValueError ("you have entered it wrong")
                            

total = sum(marks)
count = len(marks)

print ("total: ", total)

if totalMAL == "no":
    TotalT = sum(Totalril)
else:
    TotalT = len(marks)*howm

average = total*100/TotalT
print ("your percentage is: ", average)

minmarks = min(marks)
maxmarks = max(marks)

print("Your lowest mark:", minmarks)
print("Your highest mark:", maxmarks)

if average >= 35:
    print ("passed in average")
else:
    print ("failed in average")

if marks1 !=0:
    if totalMAL == "no":
     calc1 = marks1*100/Total1
    else:
     calc1 = marks1*100/howm
    if calc1 < 35:
        print ("you have failed in: ", S1)
    else:
        print ("you have passed in ", S1)
    if marks2 !=0:
        if totalMAL == "no":
         calc2 = marks2*100/Total2
        else:
         calc2 = marks2*100/howm
        if calc2 < 35:
            print ("you have failed in: ", S2)
        else:
            print ("you have passed in ", S2)
        if marks3 !=0:
            if totalMAL == "no":
             calc3 = marks3*100/Total3
            else:
             calc3 = marks3*100/howm
            if calc3 < 35:
                print ("you have failed in: ", S3)
            else:
                print ("you have passed in ", S3)
            if marks4 !=0:
                if totalMAL == "no":
                 calc4 = marks4*100/Total4
                else:
                 calc4 = marks4*100/howm
                if calc4 < 35:
                    print ("you have failed in: ", S4)
                else:
                    print ("you have passed in ", S4)
                if marks5 !=0:
                    if totalMAL == "no":
                     calc5 = marks5*100/Total5
                    else:
                     calc5 = marks5*100/howm
                    if calc5 < 35:
                        print ("you have failed in: ", S5)
                    else:
                        print ("you have passed in ", S5)
                    if marks6 !=0:
                        if totalMAL == "no":
                         calc6 = marks6*100/Total6
                        else:
                         calc6 = marks6*100/howm
                        if calc6 < 35:
                            print ("you have failed in: ", S6)
                        else:
                            print ("you have passed in ", S6)
                        if marks7 !=0:
                            if totalMAL == "no":
                             calc7 = marks7*100/Total7
                            else:
                             calc7 = marks7*100/howm
                            if calc7 < 35:
                                print ("you have failed in: ", S7)
                            else:
                                print ("you have passed in ", S7)
                            if marks8 != 0:
                                if totalMAL == "no":
                                 calc8 = marks8*100/Total8
                                else:
                                 calc8 = marks8*100/howm
                                if calc8 < 35:
                                    print ("you have failed in: ", S8)
                                else:
                                    print ("you have passed in ", S8)

print ("thank you!")