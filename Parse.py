import json
import csv
from typing import List


class School():
    def __init__(self,name,DeptList=[]):
        self.SchoolName = name
        self.DeptList=DeptList
    def __repr__(self):
        return str(self.__dict__)

    def addDept(self,dept):
        self.DeptList.append(dept.__dict__)

class Department():

    def __init__(self,name,CourseList=[]):
        self.CourseList = CourseList
        self.DeptName=name
    def __eq__(self, other):
        return isinstance(other, type(self)) \
               and self.DeptName == other.DeptName
    def __repr__(self):
        return self.DeptName + str(self.CourseList)
    def addCourse(self,course):
        self.CourseList.append(course.__dict__)


class Course():
    def __init__(self,name,SecList=[]):
        self.CourseName=name #int
        self.FullName=""
        self.SecList=SecList
    def __repr__(self):
        #return self.CourseName + "\t" +self.FullName
    #def __repr__(self):
        return str(self.CourseName)

    def addSection(self, section):
        self.SecList.append(section.__dict__)

class Section():

    def __init__(self,SecNum,type,inst):
        self.SecNum=SecNum #int
        self.Type=type #string
        self.Instructor=inst
    def __repr__(self):
        #return "\t"+ self.SecNum + "\t"+ self.Type + "\t"+self.Instructor
        return str(self.__dict__)

def makeFullName(str):
    idx=str.find("  Units:")
    idx2=str.find("-")
    str=str[idx2+2:idx]
    print(str)
    return str




def test():
    sec1=Section(1,"LAB","Charlie H")
    sec2 = Section(2, "LAB","Charlie H")
    sec3 = Section(3, "LAB","Charlie H")
    crs1=Course("CHEM 118")
    crs1.addSection(sec1)
    crs1.addSection(sec2)
    crs1.addSection(sec3)
    crs2 = Course("CHEM 280")
    crs2.addSection(sec1)
    crs2.addSection(sec2)
    crs2.addSection(sec3)
    d=Department("CHEM")
    d.addCourse(crs1)
    d.addCourse(crs2)
    s=School("Cal Poly")
    s.addDept(d)
    print(json.dumps(s.__dict__))

def main():
    #c=None
    #dept=None
    #print("a")
    CalPoly=School("Cal Poly")
    file = open("tabDelim.txt", "r")
    lst=[]
    lines =file.readlines()
    for line in lines: #obtain and sort data
        tokens = line.split("\t")
        str=tokens[1]
        if str.__contains__("Section"):
            tokens=[]
        elif tokens[0][0:2].isdigit():
            #print("hiaa")
            tokens[0]=tokens[0][0:2]
            tokens.insert(0,'')
        elif tokens[0]=="Include":
            #print("hi")
            tokens=[]
        elif tokens[1] == "Include":
            pass
        if tokens!=[]:
            lst.append(tokens)




    for idx in range(len(lst)): #populate classes
        line=lst[idx]
        fullstr=line[0][0:10]
        str=line[0][0:4]
        #print("str",str)
        if str.isupper(): #COURSE or DEPT
            str=str[0:4]
            deptName=""
            for char in str:
                if char.isalpha():
                    deptName+=char
            dept=Department(deptName)
            if not CalPoly.DeptList.__contains__(dept):
                CalPoly.DeptList.append(dept)

                #print(deptName)
            CourseName=""
            for char in fullstr:
                if char=="-":
                    break
                CourseName+=char
            c=Course(CourseName)

            c.FullName=makeFullName(line[0])
            CalPoly.DeptList.__getitem__(len(CalPoly.DeptList)-1).CourseList.append(c)
            #print(CalPoly.DeptList.__getitem__(len(CalPoly.DeptList)-1).CourseList)
            #print(c)
        str=line[1]
        if str.isdigit():
            s=Section(line[1],line[2],line[4])
            #print(line[1]+line[2]+line[4])
            lastdept=CalPoly.DeptList.__getitem__(len(CalPoly.DeptList) - 1)
            #print("LLLLLLLLL",lastdept)
            lastdept.CourseList.__getitem__(len(lastdept.CourseList)-1).SecList.append(s)
            #print(s)

        #print(lst[idx])
    #print(CalPoly.__dict__)
    #print(CalPoly.DeptList.__getitem__(0).CourseList.__getitem__(0).SecList)
    #print(CalPoly)
    #print(json.dumps(CalPoly.__dict__))


    file.close()

def main2():
    #c=None
    #dept=None
    #print("a")
    CalPoly=School("Cal Poly")
    file = open("tabDelim.txt", "r")
    lst=[]
    lines =file.readlines()
    for line in lines: #obtain and sort data
        tokens = line.split("\t")
        str=tokens[1]
        if str.__contains__("Section"):
            tokens=[]
        elif tokens[0][0:2].isdigit():
            #print("hiaa")
            tokens[0]=tokens[0][0:2]
            tokens.insert(0,'')
        elif tokens[0]=="Include":
            #print("hi")
            tokens=[]
        elif tokens[1] == "Include":
            pass
        if tokens!=[]:
            lst.append(tokens)
    lst.reverse()
    #print(lst)
    SList=[]
    CList=[]
    DList=[]


    for line in lst:
        if line[1].isdigit():
            s=Section(line[1],line[2],line[4])
            SList.append(s.__dict__)
            #print(json.dumps(s.__dict__))
        elif line[0][0:4].isupper(): #COURSE or DEPT
            courseName=line[0][0:line[0].find("-")-1]
            SList.reverse()
            c=Course(courseName,SList)
            c.FullName=makeFullName(line[0])
            SList = []
            CList.append(c.__dict__)
            # DeptName=line[0][0:line[0].find(" ")]
            # if not DList.__contains__(Department(DeptName, [])):
            #     DList.insert(0, Department(DeptName, []))
            # DList[0].CourseList.append(c.__dict__)
            # #print((DList[0].__dict__))
    CList.reverse()
    print((json.dumps(CList)))
















if __name__ == '__main__':
    test()
    #main()
    main2()

