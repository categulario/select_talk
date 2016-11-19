# Extrae la información de los archivos de excel proporcionados
# por la gente del congreso
from openpyxl import load_workbook
import json

def from_h(hour):
    return hour.split('-')[0].strip()

def to_h(col, row, worksheet):
    if cell in worksheet.merged_cells:
        end = next(filter(lambda r:r.startswith(cell+':'), worksheet.merged_cell_ranges))
        endrow = end.split(':')[1][1:]

        return worksheet['A{}'.format(endrow)].value.split('-')[1].strip()
    else:
        return worksheet['A{}'.format(row)].value.split('-')[1].strip()

if __name__ == '__main__':
    workbook = load_workbook(filename='areas.xlsx')

    sheet_names = workbook.get_sheet_names()

    organized_data = []

    for sheet_name in sheet_names:
        worksheet = workbook[sheet_name]

        for row in range(6, 23 + 1):
            for col in map(chr, range(66, 70 + 1)):
                cell = '{}{}'.format(col, row)

                if worksheet[cell].value:
                    organized_data.append({
                        'author': worksheet[cell].value,
                        'area'  : worksheet['A1'].value,
                        'place' : worksheet['A2'].value.replace('Nombre del salón: ', ''),
                        'day'   : worksheet['{}5'.format(col)].value,
                        'from'  : from_h(worksheet['A{}'.format(row)].value),
                        'to'    : to_h(col, row, worksheet),
                        'title' : 'PENDING',
                    })

    json.dump(organized_data, open('organized_data.json', 'w'), indent=2)
